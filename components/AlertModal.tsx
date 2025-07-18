"use client";

import type { AlertModalProps } from "@/interfaces/props";

import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Chip,
} from "@heroui/react";
import {
	InfoCircleIcon,
	WarningIcon,
	DangerIcon,
	SuccessIcon,
} from "@heroui/shared-icons";
import clsx from "clsx";

import { fontMono } from "@/config/fonts";

export default function AlertModal({
	onClose,
	onConfirm,
	title,
	message,
	color = "danger",
	confirmText,
	cancelText,
}: AlertModalProps) {
	const colorMap: Record<string, `rgba(${number}, ${number}, ${number})`> = {
		default: "rgba(156, 163, 175)",
		primary: "rgba(59, 130, 246)",
		secondary: "rgba(107, 114, 128)",
		success: "rgba(34, 197, 94)",
		warning: "rgba(245, 158, 11)",
		danger: "rgba(239, 68, 68)",
	};

	const getIcon = () => {
		switch (color) {
			case "default":
			case "primary":
			case "secondary":
				return (
					<InfoCircleIcon
						color={colorMap[color]}
						height={72}
						width={72}
					/>
				);

			case "warning":
				return (
					<WarningIcon
						color={colorMap[color]}
						height={72}
						width={72}
					/>
				);

			case "danger":
				return (
					<DangerIcon
						color={colorMap[color]}
						height={72}
						width={72}
					/>
				);

			case "success":
				return (
					<SuccessIcon
						color={colorMap[color]}
						height={72}
						width={72}
					/>
				);

			default:
				return;
		}
	};

	return (
		<Modal
			hideCloseButton
			className="w-full max-w-sm p-4 shadow-md"
			isOpen={true}
			placement="center"
			radius="md"
			onOpenChange={onClose}
		>
			<ModalContent>
				{(onClose) => (
					<div className="flex flex-col items-center justify-center w-full p-0 gap-14">
						<ModalHeader className="flex flex-col items-center w-full p-0 pt-10 opacity-70">
							{getIcon()}
						</ModalHeader>

						<ModalBody className="flex flex-col items-center justify-center w-full gap-4 p-0">
							<Chip
								className={clsx(
									"p-3 w-fit font-mono capitalize",
									fontMono.variable
								)}
								color={color}
								radius="full"
								size="sm"
								variant="flat"
							>
								<span className="font-semibold">{color}</span>
							</Chip>

							<div className="flex flex-col items-center justify-center w-full gap-1">
								<p className="text-2xl font-bold">{title}</p>
								<p className="text-sm font-normal">{message}</p>
							</div>
						</ModalBody>

						<ModalFooter className="flex flex-col w-full gap-2 p-0">
							{confirmText && (
								<Button
									className="w-full font-bold"
									color={color}
									radius="sm"
									variant="solid"
									onPress={onConfirm}
								>
									{confirmText}
								</Button>
							)}

							<Button
								className="w-full font-semibold"
								color="default"
								radius="sm"
								variant="flat"
								onPress={onClose}
							>
								{cancelText}
							</Button>
						</ModalFooter>
					</div>
				)}
			</ModalContent>
		</Modal>
	);
}
