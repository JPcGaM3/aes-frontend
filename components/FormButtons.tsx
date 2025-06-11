import React from "react";
import { Button } from "@heroui/button";
import type { PressEvent } from "@react-types/shared";
import type { ColorType } from "../types";

interface FormButtonsProps {
  onCancel?: (e: PressEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitColor?: ColorType;
  cancelColor?: ColorType;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitColor = "primary",
  cancelColor = "default",
}) => (
  <div className="flex gap-2 mt-4 w-full">
    {onCancel && (
      <Button
        variant="flat"
        color={cancelColor}
        onPress={onCancel}
        className="w-full"
        radius="sm"
      >
        {cancelLabel}
      </Button>
    )}
    <Button
      variant="flat"
      color={submitColor}
      className="w-full"
      radius="sm"
    >
      {submitLabel}
    </Button>
  </div>
);

export default FormButtons;
