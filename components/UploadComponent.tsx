import React from "react";
import { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Button } from "@heroui/button";

import Header from "./Header";
import FormButtons from "./FormButtons";
import AlertComponent from "./AlertComponent";

import { AlertComponentProps, UploadComponentProps } from "@/interfaces/props";
import { DeleteIcon, DownloadIcon, UploadFileIcon } from "@/utils/icons";
import { UploadedFile } from "@/interfaces/interfaces";

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
	const [alert, setAlert] = useState<AlertComponentProps | null>(null);

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

		if (duplicateFiles.length > 0) {
			setAlert({
				title: "Upload Warning",
				description: `File(s) ${duplicateFiles.join(", ")} already in the list.`,
				color: "warning",
			});
		} else if (filesSkipped > 0) {
			setAlert({
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
		<div className="flex flex-col items-center justify-center w-full max-w-sm gap-6 sm:max-w-md md:max-w-lg lg:max-w-xl">
			{/* Header ------------------------------------------------------------------------------------------------------- */}
			<Header
				subtitle="กรุณาอัปโหลดไฟล์ที่รองรับ (.xlsx, .csv)"
				title="อัปโหลดไฟล์ใบสั่งงาน"
			/>

			{/* Upload Component --------------------------------------------------------------------------------------------- */}
			<div className="flex flex-col w-full gap-2">
				{/* Download Template Button -------------------------------------------------------------------------------------- */}
				<div className="flex justify-end">
					<Button
						className="p-3"
						color="primary"
						radius="sm"
						size="sm"
						startContent={<DownloadIcon />}
						variant="flat"
						onPress={onDownloadTemplate}
					>
						Download Template
					</Button>
				</div>

				{/* Drag and Drop Area -------------------------------------------------------------------------------------------- */}
				<div className="flex justify-center w-full">
					<div
						aria-disabled={isUploading}
						className={`border-dashed border-2 rounded-2xl justify-center text-center transition-all duration-200 min-h-60 w-full
        ${isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
						role="button"
						tabIndex={0}
						onClick={() => !isUploading && fileInputRef.current?.click()}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onKeyDown={(e) => {
							if (!isUploading && (e.key === "Enter" || e.key === " ")) {
								e.preventDefault();
								fileInputRef.current?.click();
							}
						}}
					>
						{/* Hidden File Input */}
						<input
							ref={fileInputRef}
							multiple
							accept=".xlsx,.csv"
							className="hidden"
							disabled={isUploading}
							type="file"
							onChange={handleFileInputChange}
						/>

						<div className="flex flex-col items-center justify-center h-full py-8">
							<div className="flex items-center justify-center w-24 h-24 mb-2 bg-blue-100 rounded-full">
								<UploadFileIcon size={54} />
							</div>
							<p className="mt-2 text-sm font-medium text-gray-600">
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
									aria-disabled={isUploading}
									className="flex items-center justify-between p-2 pl-4 border border-gray-200 cursor-pointer bg-gray-50 rounded-xl hover:bg-gray-100"
									role="button"
									tabIndex={0}
									onClick={() => handleDownloadUploadedFile(file)}
									onKeyDown={(e) => {
										if (!isUploading && (e.key === "Enter" || e.key === " ")) {
											e.preventDefault();
											handleDownloadUploadedFile(file);
										}
									}}
								>
									<span className="text-gray-700 truncate">{file.name}</span>
									<Button
										isIconOnly
										className="p-1 text-gray-400 hover:text-red-500"
										disabled={isUploading}
										endContent={<DeleteIcon />}
										radius="sm"
										size="sm"
										variant="light"
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
				cancelLabel="ยกเลิก"
				isSubmitting={isUploading}
				size="compact"
				submitLabel="ยืนยัน"
				onCancel={onCancel}
				onSubmit={onSubmit}
			/>

			{/* Alert */}
			{alert && (
				<AlertComponent
					{...alert}
					handleClose={() => setAlert(null)}
					isVisible={alert != null}
					size="compact"
				/>
			)}
		</div>
	);
}
