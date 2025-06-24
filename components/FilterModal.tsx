"use client";

import { Modal, ModalContent, Button } from "@heroui/react";
import FormComponent from "./FormComponent";
import { FormField } from "@/interfaces/interfaces";

interface FilterModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onClose?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  initialValues?: Record<string, any>;
}

export default function FilterModal({
  isOpen,
  title,
  subtitle,
  fields,
  submitLabel,
  cancelLabel,
  onClose,
  onSubmit,
  initialValues = {},
}: FilterModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      placement="top"
      onOpenChange={onClose}
      size="sm"
      radius="sm"
      className="p-6"
    >
      <ModalContent>
        {(onClose) => (
          <FormComponent
            title={title}
            subtitle={subtitle}
            fields={fields}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            onSubmit={onSubmit}
            onCancel={onClose}
            initialValues={initialValues}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
