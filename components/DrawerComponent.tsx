import { CloseDrawerIcon } from "@/utils/icons";
import type { DrawerComponentProps } from "@/interfaces/props";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	Button,
	Tooltip,
} from "@heroui/react";

export default function DrawerComponent({
	size = "5xl",
	placement = "right",
	isOpen,
	onClose,
	children,
}: DrawerComponentProps) {
	return (
		<div>
			<Drawer
				hideCloseButton
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				size={size}
				radius="sm"
				placement={placement}
				{...(placement === "right"
					? {
							classNames: {
								base: "data-[placement=right]:m-2 data-[placement=left]:m-2 rounded-medium w-full w-[300] sm:w-[400] md:w-[500] lg:w-[600] xl:w-[700]",
							},
						}
					: {})}
			>
				<DrawerContent>
					{(onClose) => (
						<div>
							{placement === "right" && (
								<DrawerHeader className="inset-x-0 top-0 flex flex-row justify-between px-2 py-2 border-b gap-2">
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
							)}

							<div className="p-0">{children}</div>
						</div>
					)}
				</DrawerContent>
			</Drawer>
		</div>
	);
}
