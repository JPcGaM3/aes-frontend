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
			className="p-4 pt-6 m-3 shadow-md w-fit"
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
						isCompact={true}
						sections={sections}
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
