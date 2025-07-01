"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

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
      className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shadow-md p-3"
    >
      <ModalContent>
        {(onClose) => (
          <div className="flex flex-col items-center justify-center w-full p-0 gap-4">
            <ModalHeader className="flex flex-col items-center w-full text-center text-2xl p-0">
              {title}
            </ModalHeader>

            <ModalBody className="w-full flex justify-center p-0 min-h-16">
              <p className="text-center w-full">{message}</p>
            </ModalBody>

            <ModalFooter className="flex gap-2 w-full p-0">
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
