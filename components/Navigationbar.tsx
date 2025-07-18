"use client";

import React, { useRef } from "react";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
	Tab,
	Tabs,
} from "@heroui/react";
import { Button } from "@heroui/button";
import { clsx } from "clsx";

import SessionTimer from "./SessionTimer";

import { useAuth } from "@/providers/AuthContext";
import {
	HomeIcon,
	HamburgerIcon,
	CancelIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	CheckIcon,
	DocumentIcon,
	CheckFillIcon,
	UserIcon,
} from "@/utils/icons";
import { getAeArea } from "@/libs/aeAreaAPI";
import { fontMono } from "@/config/fonts";
import { AeArea } from "@/interfaces/schema";
import { USERROLE } from "@/utils/enum";
import { useAlert } from "@/providers/AlertContext";

export default function Navbar() {
	// const value & react hook -------------------------------------------------------------------------------------
	const router = useRouter();
	const pathname = usePathname();

	const { showAlert } = useAlert();
	const { userContext, setUserContext, isReady } = useAuth();

	const hasFetched = useRef(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [aeAreas, setAeAreas] = useState<{ ae_area: AeArea }[]>([]);
	const [selectedTab, setSelectedTab] = useState(pathname);

	interface MenuItem {
		name: string;
		path: string;
		icon: React.ReactNode;
		allowedRoles?: string[];
	}

	const menuItems: MenuItem[] = [
		// * Normal Page --------------------------------------------------
		{
			name: "เมนูหลัก",
			path: "/home",
			icon: <HomeIcon size={18} />,
			allowedRoles: [
				USERROLE.Admin,
				USERROLE.DepartmentHead,
				USERROLE.UnitHead,
				USERROLE.Driver,
			],
		},
		{
			name: "งาน",
			path: "/request",
			icon: <CheckFillIcon size={18} />,
			allowedRoles: [USERROLE.Admin, USERROLE.UnitHead],
		},
		{
			name: "รายการ",
			path: "/list",
			icon: <DocumentIcon size={18} />,
			allowedRoles: [USERROLE.Admin, USERROLE.DepartmentHead],
		},
		{
			name: "ผู้ใช้งาน",
			path: "/login",
			icon: <UserIcon size={18} />,
		},

		// * Componenent Page ---------------------------------------------
		// { name: "Form", path: "/form", icon: <HomeIcon /> },
		// { name: "Card", path: "/card", icon: <HomeIcon /> },
		// { name: "Drawer", path: "/drawer", icon: <HomeIcon /> },
	];

	// Fetch data ---------------------------------------------------------------------------------------------------
	useEffect(() => {
		if (
			isReady &&
			userContext &&
			userContext.token &&
			userContext.ae_id &&
			!hasFetched.current
		) {
			hasFetched.current = true;
			const fetchAeArea = async ({ token }: { token: string }) => {
				try {
					const response = await getAeArea({ token: token });

					setAeAreas(response);
				} catch (error: any) {
					showAlert({
						title: "ไม่สามารถโหลดข้อมูลได้",
						description:
							error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
						color: "danger",
					});
				}
			};

			fetchAeArea({ token: userContext!.token });
		}
	}, [userContext, isReady]);

	useEffect(() => {
		if (isReady && (!userContext?.token || !userContext?.ae_id)) {
			setAeAreas([]);
			hasFetched.current = false;
		}
	}, [userContext?.token, userContext?.ae_id, isReady]);

	useEffect(() => {
		setSelectedTab(pathname);
	}, [pathname]);

	const hasPermission = (allowedRoles: string[]) => {
		if (!allowedRoles || allowedRoles.length === 0) {
			return true;
		}

		if (!userContext?.token || !userContext?.role) return false;

		const allowedRoleStrings = allowedRoles.map((role) => String(role));

		if (Array.isArray(userContext.role)) {
			return userContext.role.some((userRole) =>
				allowedRoleStrings.includes(String(userRole))
			);
		}

		return allowedRoleStrings.includes(String(userContext.role));
	};

	const filteredMenuItems = menuItems.filter((item) =>
		hasPermission(item.allowedRoles || [])
	);

	const dynamicMenuItems = filteredMenuItems.map((item) => {
		if (item.name === "ผู้ใช้งาน") {
			return {
				...item,
				path: userContext?.token ? `/profile` : "/login",
				name: "ผู้ใช้งาน",

				...(userContext?.token && {
					allowedRoles: Object.values(USERROLE),
				}),
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
		setIsMenuOpen(false);

		const menuItem = menuItems.find((item) => item.path === path);

		if (menuItem && !hasPermission(menuItem.allowedRoles || [])) {
			router.push("/unauthorize");

			return;
		}
		router.push(path);
	};

	const handleTabChange = (key: React.Key) => {
		if (typeof key === "string") {
			setSelectedTab(key);
			handleNav(key);
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
			<HeroUINavbar
				className="z-50 flex items-center shadow-md p-0 h-18"
				classNames={{
					wrapper: "px-3 md:px-6 py-2",
				}}
				isMenuOpen={isMenuOpen}
				maxWidth="full"
				position="sticky"
				shouldHideOnScroll={false}
				onMenuOpenChange={setIsMenuOpen}
			>
				<NavbarContent className="justify-start items-center gap-2 w-full">
					{/* Logo */}
					<NavbarBrand className="flex justify-start items-center w-full h-full">
						<Button
							isIconOnly
							className="relative opacity-100 mr-4 p-0 h-full aspect-[1/1]"
							isDisabled={!userContext?.token}
							radius="sm"
							size="lg"
							variant="light"
							onPress={() => handleNav("/home")}
						>
							<Image
								fill
								priority
								alt="Logo"
								className="object-contain"
								quality={100}
								sizes="(max-height: 4828px) 48px"
								src="/pictures/logo.png"
							/>
						</Button>

						{/* Session Timer */}
						{userContext.token && (
							<NavbarItem className="flex justify-start items-center w-full h-full">
								<SessionTimer />
							</NavbarItem>
						)}
					</NavbarBrand>

					{/* Operation Dropdown */}
					{userContext.token &&
						hasFetched.current &&
						aeAreas.length > 0 && (
							<NavbarItem
								className={clsx(
									"justify-end items-center bg-default-100 rounded-lg w-fit h-full font-mono",
									fontMono.variable
								)}
							>
								<Popover
									className={clsx(
										"font-mono",
										fontMono.variable
									)}
									isOpen={isDropdownOpen}
									placement="bottom-end"
									onOpenChange={setIsDropdownOpen}
								>
									<PopoverTrigger>
										<Button
											className="flex flex-row justify-between gap-3 px-3 w-fit min-w-24 h-full font-bold text-lg"
											color="default"
											endContent={
												isDropdownOpen ? (
													<ChevronUpIcon />
												) : (
													<ChevronDownIcon
														strokeWidth={2}
													/>
												)
											}
											radius="sm"
											size="lg"
											variant="light"
											onPress={() =>
												setIsDropdownOpen(
													!isDropdownOpen
												)
											}
										>
											{getAeAreaLabel(userContext.ae_id)}
										</Button>
									</PopoverTrigger>

									<PopoverContent className="shadow-lg mt-1 p-1 rounded-lg w-fit min-w-24">
										<div className="flex flex-col w-full font-semibold text-sm">
											{aeAreas.length > 0 ? (
												aeAreas.map((option) => (
													<Button
														key={option.ae_area.id}
														className="justify-between p-2 w-full font-medium text-md text-left"
														color={
															userContext.ae_id ===
															option.ae_area.id
																? "primary"
																: "default"
														}
														endContent={
															userContext.ae_id ===
															option.ae_area
																.id ? (
																<CheckIcon />
															) : null
														}
														radius="sm"
														size="md"
														variant={
															userContext.ae_id ===
															option.ae_area.id
																? "flat"
																: "light"
														}
														onPress={() =>
															handleDropdownSelect(
																option.ae_area
																	.id
															)
														}
													>
														{option.ae_area.name}
													</Button>
												))
											) : (
												<div className="p-2 text-gray-400 text-center">
													No options available
												</div>
											)}
										</div>
									</PopoverContent>
								</Popover>
							</NavbarItem>
						)}

					{/* Menu Toggle */}
					<NavbarItem className="md:hidden flex justify-end items-center h-full">
						<Button
							isIconOnly
							className="p-0 h-full"
							color={isMenuOpen ? "default" : "primary"}
							endContent={
								isMenuOpen ? <CancelIcon /> : <HamburgerIcon />
							}
							radius="sm"
							size="lg"
							variant="flat"
							onPress={() => setIsMenuOpen(!isMenuOpen)}
						/>
					</NavbarItem>

					{/* Nav bar desktop */}
					<NavbarItem className="hidden md:flex flex-row items-center bg-default-100 rounded-lg w-fit h-full">
						<Tabs
							aria-label="Navigation Tabs"
							className="h-full"
							classNames={{
								base: "h-full",
								tabList:
									"gap-0 w-full relative rounded-lg p-1 h-full bg-default-100",
								cursor: "w-full bg-primary",
								tab: "max-w-fit px-3 h-full",
								tabContent:
									"group-data-[selected=true]:text-primary-foreground font-semibold text-sm",
							}}
							radius="sm"
							selectedKey={selectedTab}
							variant="solid"
							onSelectionChange={handleTabChange}
						>
							{dynamicMenuItems.map((item) => {
								const isActive = pathname === item.path;
								const hasTabPermission = hasPermission(
									item.allowedRoles || []
								);

								return (
									<Tab
										key={item.path}
										isDisabled={
											(!userContext?.token &&
												!isActive) ||
											!hasTabPermission
										}
										title={
											<div className="flex items-center gap-2">
												{isActive && item.icon}
												{item.name}
											</div>
										}
									/>
								);
							})}
						</Tabs>
					</NavbarItem>
				</NavbarContent>

				<NavbarMenu>
					{dynamicMenuItems.map((item) => {
						const isActive = pathname === item.path;

						return (
							<NavbarMenuItem key={item.path} isActive={isActive}>
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
