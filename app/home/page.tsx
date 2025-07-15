import Header from "@/components/Header";
import {
	AddIcon,
	CancelIcon,
	CardIcon,
	CheckIcon,
	ChevronDownIcon,
	ChevronsRightIcon,
	ChevronUpIcon,
	DeleteIcon,
	DiscordIcon,
	DocumentIcon,
	DownloadIcon,
	DrawerIcon,
	EditIcon,
	EyeCloseIcon,
	EyeIcon,
	FilterIcon,
	HamburgerIcon,
	HomeIcon,
	InfoIcon,
	LoginIcon,
	MinusIcon,
	MoonIcon,
	PlusIcon,
	RejectIcon,
	RequestIcon,
	SearchIcon,
	SettingIcon,
	SunIcon,
	UploadFileIcon,
	UserIcon,
	VerticalDotsIcon,
} from "@/utils/icons";
import { Button } from "@heroui/button";

export default function HomePage() {
	// All available icons from icons.tsx
	const allIcons = [
		{ name: "DiscordIcon", component: DiscordIcon },
		{ name: "MoonIcon", component: MoonIcon },
		{ name: "SunIcon", component: SunIcon },
		{ name: "SearchIcon", component: SearchIcon },
		{ name: "UserIcon", component: UserIcon },
		{ name: "PlusIcon", component: PlusIcon },
		{ name: "VerticalDotsIcon", component: VerticalDotsIcon },
		{ name: "ChevronDownIcon", component: ChevronDownIcon },
		{ name: "ChevronUpIcon", component: ChevronUpIcon },
		{ name: "EyeIcon", component: EyeIcon },
		{ name: "EyeCloseIcon", component: EyeCloseIcon },
		{ name: "ChevronsRight", component: ChevronsRightIcon },
		{ name: "FilterIcon", component: FilterIcon },
		{ name: "HamburgerIcon", component: HamburgerIcon },
		{ name: "HomeIcon", component: HomeIcon },
		{ name: "DocumentIcon", component: DocumentIcon },
		{ name: "CardIcon", component: CardIcon },
		{ name: "DrawerIcon", component: DrawerIcon },
		{ name: "LoginIcon", component: LoginIcon },
		{ name: "RequestIcon", component: RequestIcon },
		{ name: "InfoIcon", component: InfoIcon },
		{ name: "EditIcon", component: EditIcon },
		{ name: "RejectIcon", component: RejectIcon },
		{ name: "DownloadIcon", component: DownloadIcon },
		{ name: "UploadFileIcon", component: UploadFileIcon },
		{ name: "DeleteIcon", component: DeleteIcon },
		{ name: "SettingIcon", component: SettingIcon },
		{ name: "AddIcon", component: AddIcon },
		{ name: "MinusIcon", component: MinusIcon },
		{ name: "CancelIcon", component: CancelIcon },
		{ name: "CheckIcon", component: CheckIcon },
	];

	const renderIconRow = (icon: { name: string; component: any }) => {
		const IconComponent = icon.component;

		return (
			<div
				key={icon.name}
				className="flex flex-col items-center gap-y-4 bg-content1 p-4 border border-divider rounded-lg"
			>
				<h3 className="font-medium text-foreground text-small text-center">
					{icon.name}
				</h3>

				<div className="flex flex-row justify-center items-center gap-x-2 w-full">
					<Button
						isIconOnly
						className="flex flex-col items-center p-3 w-fit h-fit"
						color="default"
						radius="sm"
						size="lg"
						startContent={
							<IconComponent size={36} variant="border" />
						}
						variant="flat"
					/>

					<Button
						isIconOnly
						className="flex flex-col items-center p-3 w-fit h-fit"
						color="primary"
						radius="sm"
						size="lg"
						startContent={
							<IconComponent size={36} variant="fill" />
						}
						variant="flat"
					/>

					<Button
						isIconOnly
						className="flex flex-col items-center p-3 w-fit h-fit"
						color="default"
						radius="sm"
						size="lg"
						startContent={
							<IconComponent size={36} variant="border" />
						}
						variant="solid"
					/>

					<Button
						isIconOnly
						className="flex flex-col items-center p-3 w-fit h-fit"
						color="primary"
						radius="sm"
						size="lg"
						startContent={
							<IconComponent size={36} variant="fill" />
						}
						variant="solid"
					/>
				</div>
			</div>
		);
	};

	return (
		<div className="bg-background min-h-screen">
			<Header subtitle="ยินดีต้อนรับสู่ AE Service" title="หน้าหลัก" />

			<div className="flex flex-col gap-y-6 py-8 w-full">
				<Header
					hasBorder={false}
					orientation="horizontal"
					subtitle="Below are all the icons defined in the icons.tsx file displayed in 4 different styles"
					title="All Available Icons"
				/>

				<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{allIcons.map(renderIconRow)}
				</div>
			</div>
		</div>
	);
}
