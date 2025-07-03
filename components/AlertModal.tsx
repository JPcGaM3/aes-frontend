"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import type { AlertModalProps } from "@/interfaces/props";

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
      isOpen={isOpen}
      placement="center"
      onOpenChange={onClose}
      size="sm"
      radius="sm"
      className="w-full max-w-sm p-3 shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl"
    >
      <ModalContent>
        {(onClose) => (
          <div className="flex flex-col items-center justify-center w-full p-0 gap-4">
            <ModalHeader className="flex flex-col items-center w-full p-0 text-2xl text-center">
              {title}
            </ModalHeader>

            <ModalBody className="flex justify-center w-full p-0 min-h-16">
              <p className="w-full text-center">{message}</p>
            </ModalBody>

            <ModalFooter className="flex w-full p-0 gap-2">
              <Button
                radius="sm"
                color="danger"
                variant="flat"
                className="w-full font-semibold"
                onPress={onClose}
              >
                {cancelText}
              </Button>

              {confirmText && (
                <Button
                  radius="sm"
                  color="primary"
                  variant="solid"
                  className="w-full font-semibold"
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
