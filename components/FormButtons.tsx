import type { PressEvent } from "@react-types/shared";
import type { ColorType } from "../types";

import React from "react";
import { Button } from "@heroui/button";

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
        className="w-full font-semibold text-gray-500"
        color={cancelColor}
        radius="sm"
        variant="flat"
        onPress={onCancel}
      >
        {cancelLabel}
      </Button>
    )}
    <Button className="w-full font-bold" color={submitColor} radius="sm" variant="flat" type="submit">
      {submitLabel}
    </Button>
  </div>
);

export default FormButtons;
