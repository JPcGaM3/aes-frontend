import React from "react";
import { useRef, useState, ChangeEvent, DragEvent } from "react";

import { UploadedFile } from "@/interfaces/interfaces";
import { DeleteIcon, DownloadIcon, UploadFileIcon } from "@/utils/icons";

import { Button } from "@heroui/button";

import Header from "./Header";
import FormButtons from "./FormButtons";
import AlertComponent, { AlertComponentProps } from "./AlertComponent";

interface UploadComponentProps {
  maxFiles?: number;
  isUploading?: boolean;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onDownloadTemplate?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function UploadComponent({
  maxFiles = 5,
  isUploading = false,
  uploadedFiles,
  setUploadedFiles,
  onDownloadTemplate,
  onSubmit,
  onCancel,
}: UploadComponentProps) {
  // Const and State --------------------------------------------------------------------------------------------------------
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  // Handlers ---------------------------------------------------------------------------------------------------------------
  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
      e.target.value = "";
    }
  };

  const handleFiles = (files: File[]): void => {
    const allowedFiles: File[] = files.filter(
      (file) => file.name.endsWith(".xlsx") || file.name.endsWith(".csv")
    );

    const currentFileCount = uploadedFiles.length;
    let filesAddedCount = 0;
    const filesToAddNew: UploadedFile[] = [];
    let filesSkipped = 0;
    const duplicateFiles: string[] = [];

    for (const file of allowedFiles) {
      if (uploadedFiles.some((f) => f.name === file.name)) {
        duplicateFiles.push(file.name);
        filesSkipped++;
        continue;
      }

      if (currentFileCount + filesAddedCount < maxFiles) {
        filesToAddNew.push({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
        });
        filesAddedCount++;
      } else {
        filesSkipped++;
      }
    }

    // Show duplicate alert first if any, else show skipped alert if any
    if (duplicateFiles.length > 0) {
      setAlert({
        isVisible: true,
        title: "Upload Warning",
        description: `File(s) ${duplicateFiles.join(", ")} already in the list.`,
        color: "warning",
      });
    } else if (filesSkipped > 0) {
      setAlert({
        isVisible: true,
        title: "Upload Warning",
        description: `You can only upload a maximum of ${maxFiles} files. ${filesSkipped} file(s) were not added or were duplicates.`,
        color: "warning",
      });
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...filesToAddNew]);
  };

  const handleDeleteFile = (fileName: string): void => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleDownloadUploadedFile = (file: UploadedFile): void => {
    const link = document.createElement("a");

    link.href = URL.createObjectURL(file.file);
    link.download = file.name;
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl justify-center gap-6 items-center">
      {/* Header ------------------------------------------------------------------------------------------------------- */}
      <Header
        title="อัปโหลดไฟล์ใบสั่งงาน"
        subtitle="กรุณาอัปโหลดไฟล์ที่รองรับ (.xlsx, .csv)"
      />

      {/* Upload Component --------------------------------------------------------------------------------------------- */}
      <div className="flex flex-col w-full gap-2">
        {/* Download Template Button -------------------------------------------------------------------------------------- */}
        <div className="flex justify-end">
          <Button
            size="sm"
            radius="sm"
            variant="flat"
            color="primary"
            className="p-3"
            startContent={<DownloadIcon />}
            onPress={onDownloadTemplate}
          >
            Download Template
          </Button>
        </div>

        {/* Drag and Drop Area -------------------------------------------------------------------------------------------- */}
        <div className="flex justify-center w-full">
          <div
            className={`border-dashed border-2 rounded-2xl justify-center text-center transition-all duration-200 min-h-60 w-full
                        ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
                        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx,.csv"
              multiple
              onChange={handleFileInputChange}
              disabled={isUploading}
            />

            <div className="flex flex-col justify-center items-center h-full py-8">
              <div className="mb-2 flex items-center justify-center w-24 h-24 rounded-full bg-blue-100">
                <UploadFileIcon size={54} />
              </div>
              <p className="mt-2 text-gray-600 text-sm font-medium">
                คลิกที่นี่หรือลากวางไฟล์เพื่ออัปโหลด
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 font-semibold text-gray-800">
              {uploadedFiles.length} file
              {uploadedFiles.length > 1 ? "s" : ""} was uploaded
            </p>

            <div className="flex flex-col gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.name}
                  onClick={() => handleDownloadUploadedFile(file)}
                  className="flex justify-between items-center bg-gray-50 p-2 pl-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-gray-700 truncate">{file.name}</span>

                  <Button
                    size="sm"
                    radius="sm"
                    variant="light"
                    disabled={isUploading}
                    isIconOnly
                    endContent={<DeleteIcon />}
                    className="p-1 text-gray-400 hover:text-red-500"
                    onPress={() => handleDeleteFile(file.name)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Button ------------------------------------------------------------------------------------------------------- */}
      <FormButtons
        submitLabel="ยืนยัน"
        cancelLabel="ยกเลิก"
        isSubmitting={isUploading}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />

      {/* Alert */}
      {alert.isVisible && (
        <AlertComponent
          title={alert.title}
          description={alert.description}
          color={alert.color}
          isVisible={alert.isVisible}
          handleClose={() => setAlert({ ...alert, isVisible: false })}
        />
      )}
    </div>
  );
}
