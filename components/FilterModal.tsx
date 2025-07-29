"use client";

import type { FilterModalProps } from "@/interfaces/props";

import { Modal, ModalContent } from "@heroui/react";

import FormComponent from "./FormComponent";

export default function FilterModal({
	isOpen,
	title,
	subtitle,
	sections,
	values,
	submitLabel = "ใช้งานตัวกรอง",
	cancelLabel = "ยกเลิก",
	onChange,
	onClose,
	onSubmit,
}: FilterModalProps) {
	return (
		<Modal
			className="items-center justify-center w-full p-4 pt-6 m-3 shadow-md sm:m-3 max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[700px] 2xl:max-w-[800px]"
			isOpen={isOpen}
			placement="center"
			radius="sm"
			size="lg"
			onOpenChange={onClose}
		>
			<ModalContent>
				{(onClose) => (
					<FormComponent
						cancelLabel={cancelLabel}
						sections={sections}
						size="full"
						submitLabel={submitLabel}
						subtitle={subtitle}
						title={title}
						values={values}
						onCancel={onClose}
						onChange={onChange}
						onSubmit={onSubmit}
					/>
				)}
			</ModalContent>
		</Modal>
	);
}
