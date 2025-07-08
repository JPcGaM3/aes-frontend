"use client";

import type { AlertModalProps } from "@/interfaces/props";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@heroui/react";

export default function AlertModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText,
	cancelText,
}: AlertModalProps) {
	return (
		<Modal
			className="w-full max-w-sm p-3 shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl"
			isOpen={isOpen}
			placement="center"
			radius="sm"
			size="sm"
			onOpenChange={onClose}
		>
			<ModalContent>
				{(onClose) => (
					<div className="flex flex-col items-center justify-center w-full gap-4 p-0">
						<ModalHeader className="flex flex-col items-center w-full p-0 text-2xl text-center">
							{title}
						</ModalHeader>

						<ModalBody className="flex justify-center w-full p-0 min-h-16">
							<p className="w-full text-center">{message}</p>
						</ModalBody>

						<ModalFooter className="flex w-full gap-2 p-0">
							<Button
								className="w-full font-semibold"
								color="danger"
								radius="sm"
								variant="flat"
								onPress={onClose}
							>
								{cancelText}
							</Button>

							{confirmText && (
								<Button
									className="w-full font-semibold"
									color="primary"
									radius="sm"
									variant="solid"
									onPress={onConfirm}
								>
									{confirmText}
								</Button>
							)}
						</ModalFooter>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
}
