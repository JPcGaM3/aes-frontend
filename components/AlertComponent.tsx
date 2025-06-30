import { Alert } from "@heroui/react";
import React, { useEffect, useState } from "react";

export interface AlertComponentProps {
  title: string;
  description: string;
  isVisible?: boolean;
  handleClose?: () => void;
  variant?: "solid" | "bordered" | "flat" | "faded";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export default function AlertComponent({
  title,
  description,
  color = "default",
  variant = "faded",
  isVisible = true,
  handleClose,
}: AlertComponentProps) {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(
        () => handleClose?.(),
        color == "success" ? 3000 : 5000
      );
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div className="fixed left-0 right-0 top-16 flex justify-center items-center z-50 w-full p-3">
      <Alert
        title={title}
        description={description}
        radius="sm"
        color={color}
        variant={variant}
        isVisible={visible}
        isClosable={true}
        onClose={() => {
          setVisible(false);
          handleClose?.();
        }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl shadow-md"
      />
    </div>
  );
}
