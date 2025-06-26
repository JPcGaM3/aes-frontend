"use client";

import React, { ChangeEvent, DragEvent, useRef } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  monthList,
  RequestOrderTranslation,
  yearList,
} from "@/utils/constants";
import { FormField, RequestOrder, UploadedFile } from "@/interfaces/interfaces";

import { Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";

import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import FormComponent from "@/components/FormComponent";
import { uploadRequestOrder } from "@/libs/requestOrderAPI";

export default function AddRequestPage() {
  // const value & react hook -------------------------------------------------------------------------------------
  // * For key-in form
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [operationAreaOptions, setOperationAreaOptions] = useState([]);
  const [formValue, setFormValues] = useState<RequestOrder>({} as RequestOrder);

  // * For file upload
  const MAX_FILES_LIMIT = 5;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Fetch data ---------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchCustomerTypes = async () => {
      const customer_type = await getCustomerTypes();
      setCustomerTypeOptions(customer_type);
    };

    fetchCustomerTypes();
  }, []);

  useEffect(() => {
    const fetchOperationAreas = async (params: any) => {
      const operation_area = await getOperationAreas(params);
      setOperationAreaOptions(operation_area);
    };

    fetchOperationAreas({
      ae_id: userContext.ae_id,
    });
  }, []);

  useEffect(() => {
    if (userContext.ae_id !== null) {
      setFormValues({
        ae_id: userContext?.ae_id,
        ap_year: currentYear,
        ap_month: currentMonth,
        created_by: userContext?.id,
      } as RequestOrder);
    }
  }, [userContext]);

  // Handler ------------------------------------------------------------------------------------------------------
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

    for (const file of allowedFiles) {
      if (uploadedFiles.some((f) => f.name === file.name)) {
        console.warn(`File ${file.name} is already in the list.`);
        filesSkipped++;
        continue;
      }

      if (currentFileCount + filesAddedCount < MAX_FILES_LIMIT) {
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

    if (filesSkipped > 0) {
      alert(
        `You can only upload a maximum of ${MAX_FILES_LIMIT} files. ${filesSkipped} file(s) were not added or were duplicates.`
      );
    }

    setUploadedFiles((prevFiles) => [...prevFiles, ...filesToAddNew]);
  };

  const handleDeleteFile = (fileName: string): void => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleDownloadTemplate = (): void => {
    console.log("Downloading template...");

    const link = document.createElement("a");
    link.href = "/excel/request_orders_template.xlsx";
    link.download = "request_orders_template.xlsx";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Template downloaded successfully.");
  };

  const handleConfirm = async (): Promise<void> => {
    if (uploadedFiles.length === 0) {
      alert("Please upload files before confirming.");
      return;
    }

    setIsUploading(true);
    console.log(
      "Attempting to upload files with Axios:",
      uploadedFiles.map((f) => f.name)
    );

    try {
      const response = await uploadRequestOrder(uploadedFiles);
      console.log("Upload successful:", response);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = (): void => {
    console.log("Cancelling upload");
    setUploadedFiles([]);
  };

  // Field configurations ----------------------------------------------------------------------------------------
  const workOrderFields: FormField[] = [
    {
      type: "dropdown",
      isRequired: true,
      name: "customer_type_id",
      translator: RequestOrderTranslation,
      options: [
        ...customerTypeOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
      ],
    },
    {
      type: "text",
      name: "phone",
      translator: RequestOrderTranslation,
    },
    [
      {
        type: "dropdown",
        name: "operation_area_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: [
          ...operationAreaOptions.map((option: any) => ({
            label: option.operation_area,
            value: option.id,
          })),
        ],
      },
      {
        type: "number",
        name: "zone",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "number",
        name: "quota_number",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
      },
      {
        type: "text",
        name: "farmer_name",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "dropdown",
        name: "ap_year",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: yearList,
      },
      {
        type: "dropdown",
        name: "ap_month",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
        options: monthList,
      },
    ],
    {
      type: "text",
      name: "supervisor_name",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "target_area",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "land_number",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "textarea",
      name: "location_xy",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
  ];

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        className="p-0 flex flex-col w-full justify-center items-center"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="key-in"
          title="Key-in"
          className="flex flex-col w-full justify-center items-center"
        >
          <div className="p-4 flex flex-col w-full justify-center items-center">
            <FormComponent
              title="Add your request order"
              subtitle="Input your order details in the form below"
              fields={workOrderFields}
              submitLabel="Submit"
              cancelLabel="Clear form"
              onSubmit={(data) => console.log(data)}
              onCancel={() => console.log("Form cleared")}
              initialValues={formValue}
            />
          </div>
        </Tab>

        {/* Upload tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="upload"
          title="Upload"
          className="flex flex-col w-full justify-center items-center"
        >
          <div className="flex flex-col w-full justify-center items-center p-4">
            <div className="bg-white shadow-lg p-6 border border-gray-300 border-dashed rounded-lg w-full max-w-2xl">
              {/* Header -------------------------------------------------------------------------------------------------------- */}
              <h2 className="mb-2 font-semibold text-xl">อัปโหลดไฟล์</h2>
              <p className="mb-4 text-gray-600">
                ไฟล์ที่รองรับ ไฟล์ Excel (.xlsx, .csv)
              </p>

              {/* Download Template Button -------------------------------------------------------------------------------------- */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="flex items-center bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-md text-blue-600 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Template
                </button>
              </div>

              {/* Removed the input fields for aeId and createdBy */}
              {/* They are still passed via formData, but not visible to the user */}

              {/* Drag and Drop Area -------------------------------------------------------------------------------------------- */}
              <div
                className={`border-2 ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50"
                    : "border-dashed border-gray-300"
                } rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".xlsx,.csv"
                  multiple
                  onChange={handleFileInputChange}
                  disabled={isUploading}
                />
                <div className="flex flex-col justify-center items-center">
                  <div className="mb-2 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm12-9h-5V4.5L18.5 9z" />
                      <path
                        fillRule="evenodd"
                        d="M13 11a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M12 15a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M11 19a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    คลิกที่นี่หรือลากวางไฟล์เพื่ออัปโหลด
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 font-semibold text-gray-800">
                    {uploadedFiles.length} file
                    {uploadedFiles.length > 1 ? "s" : ""} was uploaded
                  </p>
                  <div className="space-y-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.name}
                        className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-md"
                      >
                        <span className="text-gray-700 truncate">
                          {file.name}
                        </span>
                        <button
                          onClick={() => handleDeleteFile(file.name)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          aria-label={`Delete ${file.name}`}
                          disabled={isUploading}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="hover:bg-gray-50 px-6 py-2 border border-gray-300 rounded-md text-gray-700"
                  disabled={isUploading}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isUploading || uploadedFiles.length === 0}
                >
                  {isUploading ? (
                    <svg
                      className="mr-3 -ml-1 w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  )}
                  {isUploading ? "กำลังอัปโหลด..." : "ยืนยัน"}
                </button>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
