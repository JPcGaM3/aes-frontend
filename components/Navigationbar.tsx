"use client";

import React from "react";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";
import { useRouter, usePathname } from "next/navigation";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Popover, PopoverContent, PopoverTrigger, user } from "@heroui/react";
import { Button } from "@heroui/button";

import Image from "next/image";

import { getOperationAreasUser } from "@/libs/operationAreaAPI";

import {
  HomeIcon,
  CardIcon,
  DrawerIcon,
  RequestIcon,
  HamburgerIcon,
  SettingIcon,
  DocumentIcon,
  UserIcon,
  CancelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/utils/icons";
import { clsx } from "clsx";
import { fontMono } from "@/config/fonts";

export default function Navbar() {
  // const value & react hook -------------------------------------------------------------------------------------
  const router = useRouter();
  const pathname = usePathname();

  const { setIsLoading } = useLoading();
  const { userContext, setUserContext } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [operationAreas, setOperationAreas] = useState<any[]>([]);

  const menuItems = [
    // * Normal Page --------------------------------------------------
    { name: "เมนูหลัก", path: "/home", icon: <HomeIcon size={18} /> },
    { name: "งาน", path: "/request", icon: <RequestIcon size={18} /> },
    { name: "รายการ", path: "/list", icon: <DocumentIcon size={18} /> },
    { name: "การตั้งค่า", path: "/setting", icon: <SettingIcon size={18} /> },
    { name: "ผู้ใช้งาน", path: "/login", icon: <UserIcon size={18} /> },
    // * Componenent Page ---------------------------------------------
    // { name: "Form", path: "/form", icon: <DocumentIcon /> },
    // { name: "Card", path: "/card", icon: <CardIcon /> },
    // { name: "Drawer", path: "/drawer", icon: <DrawerIcon /> },
  ];

  // Fetch data ---------------------------------------------------------------------------------------------------
  // TODO: core fetch function
  useEffect(() => {
    if (userContext.token) {
      console.log("User context:", userContext);

      const fetchOperationAreas = async ({ token }: { token: string }) => {
        try {
          const response = await getOperationAreasUser({ token });
          setOperationAreas(response);
          console.log("Fetched operation areas:", response);
        } catch (error: any) {
          console.error("Failed to fetch operation areas:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOperationAreas({ token: userContext!.token });
    }
  }, [userContext]);

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

  const operationOptions = operationAreas.map((area) => ({
    value: String(area.operation_area.id),
    label: area.operation_area.operation_area,
  }));

  const getOperationAreaLabel = (id: number) => {
    const found = operationOptions.find(
      (option) => option.value === String(id)
    );

    return found ? found.label : "OP_AREA";
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

  const handleDropdownSelect = (value: string) => {
    setIsDropdownOpen(false);
    setUserContext({
      operationAreaId: Number(value),
    });
  };

  return (
    <HeroUINavbar
      maxWidth="full"
      position="sticky"
      shouldHideOnScroll={false}
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="shadow-md p-0 h-18 z-[100] flex items-center"
      classNames={{
        wrapper: "px-3 py-2",
      }}
    >
      <NavbarContent className="w-full items-center justify-start gap-2">
        {/* Logo */}
        <NavbarBrand className="h-full w-full flex items-center justify-start p-0">
          <div className="relative h-full aspect-[1/1]">
            <Image
              src="/pictures/logo.png"
              alt="Logo"
              fill
              quality={100}
              priority
              className="object-contain"
              sizes="(max-height: 4828px) 48px"
            />
          </div>
        </NavbarBrand>

        {/* Operation Dropdown */}
        {userContext.token && (
          <NavbarItem
            className={clsx(
              "h-full justify-end items-center font-mono  bg-default-100 rounded-lg",
              fontMono.variable
            )}
          >
            <Popover
              className={clsx("font-mono", fontMono.variable)}
              placement="bottom-end"
              isOpen={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <PopoverTrigger>
                <Button
                  size="lg"
                  radius="sm"
                  variant="light"
                  color="default"
                  endContent={
                    isDropdownOpen ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon strokeWidth={2} />
                    )
                  }
                  className="h-full min-w-28 w-fit font-bold text-lg flex flex-row justify-between gap-3 px-3"
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {getOperationAreaLabel(userContext.operationAreaId)}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="rounded-lg shadow-lg mt-1 w-28 p-1">
                <div className="flex flex-col text-sm w-full font-semibold">
                  {operationOptions.length > 0 ? (
                    operationOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="light"
                        size="md"
                        radius="sm"
                        className="w-full justify-start text-left p-2 font-medium"
                        onPress={() => handleDropdownSelect(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))
                  ) : (
                    <div className="text-gray-400 p-2 text-center">
                      No options available
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </NavbarItem>
        )}

        {/* Menu Toggle */}
        <NavbarItem className="flex md:hidden h-full justify-end items-center">
          <Button
            size="lg"
            radius="sm"
            variant="flat"
            color={isMenuOpen ? "default" : "primary"}
            isIconOnly
            endContent={isMenuOpen ? <CancelIcon /> : <HamburgerIcon />}
            className="h-full p-0"
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          />
        </NavbarItem>

        {/* Nav bar menu */}
        <NavbarItem className="hidden md:flex h-full p-[4px] bg-default-100 rounded-lg flex-row items-center ">
          {dynamicMenuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Button
                key={item.name}
                variant={isActive ? "solid" : "light"}
                color={isActive ? "primary" : "default"}
                size="md"
                radius="sm"
                disabled={!userContext?.token && !isActive}
                className={`font-semibold px-2 flex justify-center items-center gap-2 h-full
                    ${!(userContext?.token || isActive) ? "opacity-50 cursor-not-allowed" : ""}`}
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
                variant={isActive ? "flat" : "light"}
                color={isActive ? "primary" : "default"}
                disabled={!userContext?.token && !isActive}
                size="md"
                radius="sm"
                startContent={item.icon}
                className={`w-full justify-start text-left p-3 font-semibold
                  ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                onPress={() => handleNav(item.path)}
              >
                {item.name}
              </Button>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </HeroUINavbar>
  );
}
