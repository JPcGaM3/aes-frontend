import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@heroui/react";
import React from "react";

import { ColorType } from "@/types";

interface ActionConfig {
  key: string;
  color: ColorType;
  label: string;
  onClick?: (item: any) => void;
}

export const DrawerComponent = ({
  children,
  isOpen,
  onOpen,
  onOpenChange,
  onClose,
  drawerTitle,
  actions,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onClose: () => void;
  drawerTitle: string;
  actions?: ActionConfig[];
}) => {
  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {drawerTitle}
              </DrawerHeader>
              <DrawerBody>{children}</DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {actions && actions.length > 0 ? (
                  actions.map((action) => (
                    <Button
                      key={action.key}
                      color={action.color}
                      variant="light"
                      onPress={() => action.onClick && action.onClick(action)}
                    >
                      {action.label}
                    </Button>
                  ))
                ) : (
                  <></>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
