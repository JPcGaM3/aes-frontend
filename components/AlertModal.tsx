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
};

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}: AlertModalProps) => {
  return (
    <Modal isOpen={isOpen} placement="top" onOpenChange={onClose} size="sm" radius="sm">
      <ModalContent>
        {(onClose) => (
          <div className="flex flex-col items-center justify-center w-full p-0 gap-4">
            <ModalHeader className="flex flex-col gap-1 items-center w-full text-center">{title}</ModalHeader>

            <ModalBody className="w-full flex justify-center">
              <p className="text-center w-full">{message}</p>
            </ModalBody>

            <ModalFooter className="flex gap-2 w-full">
              <Button color="danger" variant="flat" onPress={onClose} radius="sm" className="w-full">
                {cancelText}
              </Button>

              {confirmText && (
                <Button color="primary" onPress={onConfirm} radius="sm" className="w-full">
                  {confirmText}
                </Button>
              )}
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
