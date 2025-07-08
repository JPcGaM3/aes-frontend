import type { DrawerComponentProps } from "@/interfaces/props";

import { Drawer, DrawerContent, DrawerHeader, Button } from "@heroui/react";

import { CloseDrawerIcon } from "@/utils/icons";

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
				placement={placement}
				radius="sm"
				scrollBehavior="inside"
				size={size}
				onClose={onClose}
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
								<DrawerHeader className="inset-x-0 top-0 flex flex-row justify-between gap-2 px-2 py-2 border-b">
									<Button
										isIconOnly
										className="text-default-400"
										size="sm"
										variant="light"
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
