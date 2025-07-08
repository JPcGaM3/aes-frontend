"use client";

import { Modal, ModalContent, Button } from "@heroui/react";
import FormComponent from "./FormComponent";
import type { FilterModalProps } from "@/interfaces/props";

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
			isOpen={isOpen}
			placement="center"
			onOpenChange={onClose}
			size="sm"
			radius="sm"
			className="w-full p-4 pt-6 m-3 shadow-md"
		>
			<ModalContent>
				{(onClose) => (
					<FormComponent
						isCompact={true}
						title={title}
						subtitle={subtitle}
						sections={sections}
						submitLabel={submitLabel}
						cancelLabel={cancelLabel}
						onSubmit={onSubmit}
						onCancel={onClose}
						values={values}
					/>
				)}
			</ModalContent>
		</Modal>
	);
}
