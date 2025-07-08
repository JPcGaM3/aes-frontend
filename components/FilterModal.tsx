"use client";

import type { FilterModalProps } from "@/interfaces/props";

import { Modal, ModalContent } from "@heroui/react";

import FormComponent from "./FormComponent";

export default function FilterModal({
	isOpen,
	onClose,
	title,
	subtitle,
	sections,
	submitLabel,
	cancelLabel,
	onSubmit,
	values,
}: FilterModalProps) {
	return (
		<Modal
			className="w-full p-4 pt-6 m-3 shadow-md"
			isOpen={isOpen}
			placement="center"
			radius="sm"
			size="sm"
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
						onSubmit={onSubmit}
					/>
				)}
			</ModalContent>
		</Modal>
	);
}
