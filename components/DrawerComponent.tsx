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
  onClose: () => void;
}

export default function DrawerComponent({
  isOpen,
  onClose,
}: DrawerComponentProps) {
  return (
    <div>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        backdrop="blur"
        hideCloseButton
        classNames={{
          base: "data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <div>
              <DrawerHeader className="absolute top-0 inset-x-0 flex flex-row gap-2 px-2 py-2 border-b justify-between">
                <Tooltip content="Close">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400"
                    onPress={onClose}
                  >
                    <CloseDrawerIcon />
                  </Button>
                </Tooltip>
              </DrawerHeader>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
