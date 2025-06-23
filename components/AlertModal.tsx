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
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

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
    <Modal isOpen={isOpen} placement="top" onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader className="text-xl">{title}</ModalHeader>

            <ModalBody className="text-md">{message}</ModalBody>

            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {cancelText}
              </Button>
              <Button color="primary" variant="solid" onPress={onConfirm}>
                {confirmText}
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
