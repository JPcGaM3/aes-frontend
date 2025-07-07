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
		<div className="top-16 right-0 left-0 fixed flex justify-center items-center p-3 w-full">
			<div className="flex justify-center items-center w-full">
				<Modal
					isOpen={isOpen}
					placement="center"
					onOpenChange={onClose}
					size="sm"
					radius="sm"
					className="shadow-md p-4 w-full max-w-sm sm:max-w-md"
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
			</div>
		</div>
	);
}
