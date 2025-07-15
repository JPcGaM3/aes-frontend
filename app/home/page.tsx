// import { Button } from "@heroui/button";

import Header from "@/components/Header";
// import {
// 	DiscordIcon,
// 	TwitterIcon,
// 	GithubIcon,
// 	MoonIcon,
// 	SunIcon,
// 	SearchIcon,
// 	UserIcon,
// 	PlusIcon,
// 	VerticalDotsIcon,
// 	ChevronDownIcon,
// 	ChevronUpIcon,
// 	EyeIcon,
// 	EyeCloseIcon,
// 	ChevronsRight,
// 	FilterIcon,
// 	HamburgerIcon,
// 	HomeIcon,
// 	DocumentIcon,
// 	CardIcon,
// 	DrawerIcon,
// 	LoginIcon,
// 	RequestIcon,
// 	InfoIcon,
// 	EditIcon,
// 	RejectIcon,
// 	DownloadIcon,
// 	UploadFileIcon,
// 	DeleteIcon,
// 	SettingIcon,
// 	AddIcon,
// 	MinusIcon,
// 	CancelIcon,
// 	CheckIcon,
// } from "@/utils/icons";

export default function HomePage() {
	// All available icons from icons.tsx
	// const allIcons = [
	// 	{ name: "DiscordIcon", component: DiscordIcon },
	// 	{ name: "TwitterIcon", component: TwitterIcon },
	// 	{ name: "GithubIcon", component: GithubIcon },
	// 	{ name: "MoonIcon", component: MoonIcon },
	// 	{ name: "SunIcon", component: SunIcon },
	// 	{ name: "SearchIcon", component: SearchIcon },
	// 	{ name: "UserIcon", component: UserIcon },
	// 	{ name: "PlusIcon", component: PlusIcon },
	// 	{ name: "VerticalDotsIcon", component: VerticalDotsIcon },
	// 	{ name: "ChevronDownIcon", component: ChevronDownIcon },
	// 	{ name: "ChevronUpIcon", component: ChevronUpIcon },
	// 	{ name: "EyeIcon", component: EyeIcon },
	// 	{ name: "EyeCloseIcon", component: EyeCloseIcon },
	// 	{ name: "ChevronsRight", component: ChevronsRight },
	// 	{ name: "FilterIcon", component: FilterIcon },
	// 	{ name: "HamburgerIcon", component: HamburgerIcon },
	// 	{ name: "HomeIcon", component: HomeIcon },
	// 	{ name: "DocumentIcon", component: DocumentIcon },
	// 	{ name: "CardIcon", component: CardIcon },
	// 	{ name: "DrawerIcon", component: DrawerIcon },
	// 	{ name: "LoginIcon", component: LoginIcon },
	// 	{ name: "RequestIcon", component: RequestIcon },
	// 	{ name: "InfoIcon", component: InfoIcon },
	// 	{ name: "EditIcon", component: EditIcon },
	// 	{ name: "RejectIcon", component: RejectIcon },
	// 	{ name: "DownloadIcon", component: DownloadIcon },
	// 	{ name: "UploadFileIcon", component: UploadFileIcon },
	// 	{ name: "DeleteIcon", component: DeleteIcon },
	// 	{ name: "SettingIcon", component: SettingIcon },
	// 	{ name: "AddIcon", component: AddIcon },
	// 	{ name: "MinusIcon", component: MinusIcon },
	// 	{ name: "CancelIcon", component: CancelIcon },
	// 	{ name: "CheckIcon", component: CheckIcon },
	// ];

	// const renderIconRow = (icon: { name: string; component: any }) => {
	// 	const IconComponent = icon.component;

	// 	return (
	// 		<div
	// 			key={icon.name}
	// 			className="flex flex-col items-center p-4 border rounded-lg gap-y-4 border-divider bg-content1"
	// 		>
	// 			<h3 className="font-medium text-center text-small text-foreground">
	// 				{icon.name}
	// 			</h3>

	// 			<div className="flex flex-row items-center justify-center w-full gap-x-2">
	// 				<Button
	// 					isIconOnly
	// 					className="flex flex-col items-center p-3 h-fit w-fit"
	// 					color="default"
	// 					radius="sm"
	// 					size="lg"
	// 					startContent={<IconComponent size={36} variant="border" />}
	// 					variant="flat"
	// 				/>

	// 				<Button
	// 					isIconOnly
	// 					className="flex flex-col items-center p-3 h-fit w-fit"
	// 					color="primary"
	// 					radius="sm"
	// 					size="lg"
	// 					startContent={<IconComponent size={36} variant="fill" />}
	// 					variant="flat"
	// 				/>

	// 				<Button
	// 					isIconOnly
	// 					className="flex flex-col items-center p-3 h-fit w-fit"
	// 					color="default"
	// 					radius="sm"
	// 					size="lg"
	// 					startContent={<IconComponent size={36} variant="border" />}
	// 					variant="solid"
	// 				/>

	// 				<Button
	// 					isIconOnly
	// 					className="flex flex-col items-center p-3 h-fit w-fit"
	// 					color="primary"
	// 					radius="sm"
	// 					size="lg"
	// 					startContent={<IconComponent size={36} variant="fill" />}
	// 					variant="solid"
	// 				/>
	// 			</div>
	// 		</div>
	// 	);
	// };

	return (
		<div className="min-h-screen bg-background">
			<Header subtitle="ยินดีต้อนรับสู่ AE Service" title="หน้าหลัก" />

			{/* <div className="flex flex-col w-full py-8 gap-y-6">
				<Header
					hasBorder={false}
					orientation="horizontal"
					subtitle="Below are all the icons defined in the icons.tsx file displayed in 4 different styles"
					title="All Available Icons"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{allIcons.map(renderIconRow)}
				</div>
			</div> */}
		</div>
	);
}
