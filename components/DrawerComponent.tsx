import { CloseDrawerIcon } from "@/utils/icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  Button,
  Tooltip,
} from "@heroui/react";

interface DrawerComponentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DrawerComponent({
  isOpen,
  onOpenChange,
}: DrawerComponentProps) {
  return (
    <>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
        }}
        isOpen={isOpen}
        size="xl"
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltip content="Close">
                  <Button
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <CloseDrawerIcon />
                  </Button>
                </Tooltip>
              </DrawerHeader>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
