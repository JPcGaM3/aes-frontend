import { Button } from "@heroui/button";

import Header from "@/components/Header";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsDownIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	ChevronsUpIcon,
	ChevronUpIcon,
	DiscordIcon,
	DivideIcon,
	DocumentIcon,
	EyeCloseIcon,
	EyeIcon,
	FilterIcon,
	GithubIcon,
	HamburgerIcon,
	HomeIcon,
	MinusIcon,
	MoonIcon,
	MultiplyIcon,
	PlusIcon,
	SearchIcon,
	SettingIcon,
	SunIcon,
	TwitterIcon,
	UserIcon,
	VerticalDotsIcon,
} from "@/utils/icons";

export default function HomePage() {
	// All available icons from icons.tsx
	const allIcons = [
		{ name: "DiscordIcon", component: DiscordIcon },
		{ name: "GithubIcon", component: GithubIcon },
		{ name: "TwitterIcon", component: TwitterIcon },
		{ name: "MoonIcon", component: MoonIcon },
		{ name: "SunIcon", component: SunIcon },
		{ name: "SearchIcon", component: SearchIcon },
		{ name: "UserIcon", component: UserIcon },
		{ name: "VerticalDotsIcon", component: VerticalDotsIcon },
		{ name: "EyeIcon", component: EyeIcon },
		{ name: "EyeCloseIcon", component: EyeCloseIcon },
		{ name: "ChevronUpIcon", component: ChevronUpIcon },
		{ name: "ChevronsUpIcon", component: ChevronsUpIcon },
		{ name: "ChevronDownIcon", component: ChevronDownIcon },
		{ name: "ChevronsDownIcon", component: ChevronsDownIcon },
		{ name: "ChevronLeftIcon", component: ChevronLeftIcon },
		{ name: "ChevronsLeftIcon", component: ChevronsLeftIcon },
		{ name: "ChevronRightIcon", component: ChevronRightIcon },
		{ name: "ChevronsRightIcon", component: ChevronsRightIcon },
		{ name: "PlusIcon", component: PlusIcon },
		{ name: "MinusIcon", component: MinusIcon },
		{ name: "MultiplyIcon", component: MultiplyIcon },
		{ name: "DivideIcon", component: DivideIcon },
		{ name: "FilterIcon", component: FilterIcon },
		{ name: "HamburgerIcon", component: HamburgerIcon },
		{ name: "HomeIcon", component: HomeIcon },
		{ name: "DocumentIcon", component: DocumentIcon },
		{ name: "SettingIcon", component: SettingIcon },
	];

	const renderIconRow = (icon: { name: string; component: any }) => {
		const IconComponent = icon.component;

		return (
			<div
				key={icon.name}
				className="flex flex-col items-center p-4 border rounded-lg gap-y-4 bg-content1 border-divider"
			>
				<h3 className="font-medium text-center text-foreground text-small">
					{icon.name}
				</h3>

				<div className="flex flex-row items-center justify-center w-full gap-x-2">
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
		<div className="min-h-screen bg-background">
			<Header subtitle="ยินดีต้อนรับสู่ AE Service" title="หน้าหลัก" />

			<div className="flex flex-col w-full py-8 gap-y-6">
				<Header
					hasBorder={false}
					orientation="horizontal"
					subtitle="Below are all the icons defined in the icons.tsx file displayed in 4 different styles"
					title="All Available Icons"
				/>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{allIcons.map(renderIconRow)}
				</div>
			</div>
		</div>
	);
}
