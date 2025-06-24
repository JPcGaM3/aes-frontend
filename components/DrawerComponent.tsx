import { CloseDrawerIcon } from "@/utils/icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  Button,
  Tooltip,
} from "@heroui/react";

interface DrawerComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function DrawerComponent({
  size = "5xl",
  isOpen,
  onClose,
  children,
}: DrawerComponentProps) {
  return (
    <div>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        hideCloseButton
        size={size}
        scrollBehavior="inside"
        classNames={{
          base: "data-[placement=right]:m-2 data-[placement=left]:m-2 rounded-medium w-full w-[300] sm:w-[400] md:w-[500] lg:w-[600] xl:w-[700]",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <div>
              <DrawerHeader className="top-0 inset-x-0 flex flex-row gap-2 px-2 py-2 border-b justify-between">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-default-400"
                  onPress={onClose}
                >
                  <CloseDrawerIcon />
                </Button>
              </DrawerHeader>

              <div className="px-2 py-4">{children}</div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
