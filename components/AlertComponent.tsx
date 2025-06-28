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
      const timer = setTimeout(() => handleClose?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Alert
      title={title}
      description={description}
      radius="sm"
      color={color}
      variant={variant}
      isVisible={visible}
      isClosable={true}
      onClose={handleClose}
      className="w-full max-w-xl shadow-md"
    />
  );
}
