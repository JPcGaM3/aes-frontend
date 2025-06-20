"use client";

import { Button, useDisclosure } from "@heroui/react";

import DrawerComponent from "@/components/DrawerComponent";

export default function DrawerPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen}>Open Drawer</Button>
      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
