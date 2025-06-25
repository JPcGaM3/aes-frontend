import type { PressEvent } from "@react-types/shared";
import type { ColorType } from "../types";

import React from "react";
import { Button } from "@heroui/button";

interface FormButtonsProps {
  onCancel?: (e: PressEvent) => void;
  hasBorder?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitColor?: ColorType;
  cancelColor?: ColorType;
  className?: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  hasBorder = true,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  submitColor = "primary",
  cancelColor = "default",
  className = "w-full text-center flex flex-col",
}) => (
  <div className={className}>
    {hasBorder && <hr className="mb-6 border-gray-200" />}

    <div className="flex gap-2 w-full">
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

      <Button
        className="w-full font-bold"
        color={submitColor}
        radius="sm"
        variant="flat"
        type="submit"
      >
        {submitLabel}
      </Button>
    </div>
  </div>
);

export default FormButtons;
