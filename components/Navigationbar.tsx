"use client";

import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
} from "@heroui/navbar";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { Button } from "@heroui/button";
import { clsx } from "clsx";

import AlertComponent from "./AlertComponent";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import {
	HomeIcon,
	RequestIcon,
	HamburgerIcon,
	SettingIcon,
	DocumentIcon,
	UserIcon,
	CancelIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from "@/utils/icons";
import { getAeArea } from "@/libs/aeAreaAPI";
import { fontMono } from "@/config/fonts";
import { AeArea } from "@/interfaces/schema";
import { AlertComponentProps } from "@/interfaces/props";

export default function Navbar() {
	// const value & react hook -------------------------------------------------------------------------------------
	const router = useRouter();
	const pathname = usePathname();

	const { setIsLoading } = useLoading();
	const { userContext, setUserContext, isReady } = useAuth();

	const [hasMounted, setHasMounted] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [aeAreas, setAeAreas] = useState<{ ae_area: AeArea }[]>([]);
	const [alert, setAlert] = useState<AlertComponentProps>({
		title: "",
		description: "",
		isVisible: false,
	});

	const menuItems = [
		// * Normal Page --------------------------------------------------
		{ name: "เมนูหลัก", path: "/home", icon: <HomeIcon size={18} /> },
		{ name: "งาน", path: "/request", icon: <RequestIcon size={18} /> },
		{ name: "รายการ", path: "/list", icon: <DocumentIcon size={18} /> },
		{
			name: "การตั้งค่า",
			path: "/setting",
			icon: <SettingIcon size={18} />,
		},
		{ name: "ผู้ใช้งาน", path: "/login", icon: <UserIcon size={18} /> },
		// * Componenent Page ---------------------------------------------
		// { name: "Form", path: "/form", icon: <DocumentIcon /> },
		// { name: "Card", path: "/card", icon: <CardIcon /> },
		// { name: "Drawer", path: "/drawer", icon: <DrawerIcon /> },
	];

	// Fetch data ---------------------------------------------------------------------------------------------------
	useEffect(() => {
		setIsLoading(true);

		if (isReady && userContext && userContext.token && userContext.ae_id) {
			const fetchAeArea = async ({ token }: { token: string }) => {
				try {
					const response = await getAeArea({ token: token });

					setAeAreas(response);
				} catch (error: any) {
					setAlert({
						title: "Error fetching areas",
						description: error.message,
						isVisible: true,
					});
				}
			};

			fetchAeArea({ token: userContext!.token });
		}

		setHasMounted(true);
	}, [userContext, isReady]);

	const dynamicMenuItems = menuItems.map((item) => {
		if (item.name === "ผู้ใช้งาน") {
			return {
				...item,
				path: userContext?.token ? `/profile` : "/login",
				name: "ผู้ใช้งาน",
			};
		}

		return item;
	});

	const getAeAreaLabel = (id: number) => {
		const found = aeAreas.find((area) => area.ae_area.id === id);

		return found ? found.ae_area.name : "AE_AREA";
	};

	// Handler ------------------------------------------------------------------------------------------------------
	const handleNav = (path: string) => {
		setIsLoading(true);
		setIsMenuOpen(false);

		if (path === pathname) {
			window.location.reload();
		} else {
			router.push(path);
		}
	};

	const handleDropdownSelect = (value: number) => {
		setIsDropdownOpen(false);
		setUserContext({
			ae_id: value,
		});
	};

	return (
		<>
			{alert.isVisible && (
				<AlertComponent
					description={alert.description}
					handleClose={() => setAlert({ ...alert, isVisible: false })}
					isVisible={alert.isVisible}
					title={alert.title}
				/>
			)}

			<HeroUINavbar
				className="z-50 flex items-center p-0 shadow-md h-18"
				classNames={{
					wrapper: "px-3 md:px-6 py-2",
				}}
				isMenuOpen={isMenuOpen}
				maxWidth="full"
				position="sticky"
				shouldHideOnScroll={false}
				onMenuOpenChange={setIsMenuOpen}
			>
				<NavbarContent className="items-center justify-start w-full gap-2">
					{/* Logo */}
					<NavbarBrand className="flex items-center justify-start w-full h-full p-0">
						<div className="relative h-full aspect-[1/1]">
							<Image
								fill
								priority
								alt="Logo"
								className="object-contain"
								quality={100}
								sizes="(max-height: 4828px) 48px"
								src="/pictures/logo.png"
							/>
						</div>
					</NavbarBrand>

					{/* Operation Dropdown */}
					{userContext.token && hasMounted && (
						<NavbarItem
							className={clsx(
								"h-full justify-end items-center font-mono  bg-default-100 rounded-lg w-fit",
								fontMono.variable
							)}
						>
							<Popover
								className={clsx("font-mono", fontMono.variable)}
								isOpen={isDropdownOpen}
								placement="bottom-end"
								onOpenChange={setIsDropdownOpen}
							>
								<PopoverTrigger>
									<Button
										className="flex flex-row justify-between h-full gap-3 px-3 text-lg font-bold min-w-20 w-fit"
										color="default"
										endContent={
											isDropdownOpen ? (
												<ChevronUpIcon />
											) : (
												<ChevronDownIcon strokeWidth={2} />
											)
										}
										radius="sm"
										size="lg"
										variant="light"
										onPress={() => setIsDropdownOpen(!isDropdownOpen)}
									>
										{getAeAreaLabel(userContext.ae_id)}
									</Button>
								</PopoverTrigger>

								<PopoverContent className="p-1 mt-1 rounded-lg shadow-lg w-fit min-w-20">
									<div className="flex flex-col w-full text-sm font-semibold">
										{aeAreas.length > 0 ? (
											aeAreas.map((option) => (
												<Button
													key={option.ae_area.id}
													className="justify-start w-full p-2 font-medium text-left"
													radius="sm"
													size="md"
													variant="light"
													onPress={() =>
														handleDropdownSelect(option.ae_area.id)
													}
												>
													{option.ae_area.name}
												</Button>
											))
										) : (
											<div className="p-2 text-center text-gray-400">
												No options available
											</div>
										)}
									</div>
								</PopoverContent>
							</Popover>
						</NavbarItem>
					)}

					{/* Menu Toggle */}
					<NavbarItem className="flex items-center justify-end h-full md:hidden">
						<Button
							isIconOnly
							className="h-full p-0"
							color={isMenuOpen ? "default" : "primary"}
							endContent={isMenuOpen ? <CancelIcon /> : <HamburgerIcon />}
							radius="sm"
							size="lg"
							variant="flat"
							onPress={() => setIsMenuOpen(!isMenuOpen)}
						/>
					</NavbarItem>

					{/* Nav bar desktop */}
					<NavbarItem className="hidden md:flex h-full p-[4px] bg-default-100 rounded-lg flex-row items-center ">
						{dynamicMenuItems.map((item) => {
							const isActive = pathname === item.path;

							return (
								<Button
									key={item.name}
									className={`font-semibold px-2 flex justify-center items-center gap-2 h-full
                    ${!(userContext?.token || isActive) ? "opacity-50 cursor-not-allowed" : ""}`}
									color={isActive ? "primary" : "default"}
									disabled={!userContext?.token && !isActive}
									radius="sm"
									size="md"
									variant={isActive ? "solid" : "light"}
									onPress={() => handleNav(item.path)}
								>
									{isActive && item.icon}
									{item.name}
								</Button>
							);
						})}
					</NavbarItem>
				</NavbarContent>

				<NavbarMenu>
					{dynamicMenuItems.map((item) => {
						const isActive = pathname === item.path;

						return (
							<NavbarMenuItem key={item.name} isActive={isActive}>
								<Button
									disableAnimation
									className={`w-full justify-start text-left p-3 font-semibold ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}`}
									color={isActive ? "primary" : "default"}
									disabled={!userContext?.token && !isActive}
									radius="sm"
									size="md"
									startContent={item.icon}
									variant={isActive ? "flat" : "light"}
									onPress={() => handleNav(item.path)}
								>
									{item.name}
								</Button>
							</NavbarMenuItem>
						);
					})}
				</NavbarMenu>
			</HeroUINavbar>
		</>
	);
}
