import { Alert } from "@heroui/react";
import React, { useEffect, useState } from "react";
import type { AlertComponentProps } from "@/interfaces/props";

export default function AlertComponent({
  title,
  description,
  color = "default",
  variant = "faded",
  isCompact = false,
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

  const computedClassName = isCompact
    ? "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
    : "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl";

  return (
    <div className="fixed left-0 right-0 z-50 flex items-center justify-center w-full p-3 top-16">
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
        className={computedClassName}
      />
    </div>
  );
}
