"use client";

import { Modal, ModalContent, Button } from "@heroui/react";
import FormComponent from "./FormComponent";
import type { FilterModalProps } from "@/interfaces/props";

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
    <div className="fixed left-0 right-0 flex items-center justify-center w-full p-3 top-16">
      <div className="flex items-center justify-center w-full">
        <Modal
          isOpen={isOpen}
          placement="center"
          onOpenChange={onClose}
          size="sm"
          radius="sm"
          className="w-full max-w-sm p-4 shadow-md sm:max-w-md"
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
      </div>
    </div>
  );
}
