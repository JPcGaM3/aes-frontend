"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";

import { Button } from "@heroui/button";

import Image from "next/image";
import DrawerComponent from "./DrawerComponent";

import {
  HomeIcon,
  CardIcon,
  DrawerIcon,
  RequestIcon,
  HamburgerIcon,
  SettingIcon,
  DocumentIcon,
  UserIcon,
} from "@/utils/icons";

const menuItems = [
  // * Normal Page --------------------------------------------------
  { name: "เมนูหลัก", path: "/home", icon: <HomeIcon /> },
  { name: "งาน", path: "/request", icon: <RequestIcon /> },
  { name: "รายการ", path: "/list", icon: <DocumentIcon /> },
  { name: "การตั้งค่า", path: "/setting", icon: <SettingIcon /> },
  { name: "ผู้ใช้งาน", path: "/login", icon: <UserIcon /> },
  // * Componenent Page ---------------------------------------------
  // { name: "Form", path: "/form", icon: <DocumentIcon /> },
  // { name: "Card", path: "/card", icon: <CardIcon /> },
  // { name: "Drawer", path: "/drawer", icon: <DrawerIcon /> },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoading();
  const { userContext } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path: string) => {
    setIsLoading(true);
    setDrawerOpen(false);

    if (path === pathname) {
      window.location.reload();
    } else {
      router.push(path);
    }
  };

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

  return (
    <HeroUINavbar
      className="shadow-md p-0 h-16 flex items-center"
      maxWidth="full"
      position="sticky"
      shouldHideOnScroll={false}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-full w-auto">
        <div className="w-12 h-12 flex items-center justify-center">
          <Image
            src="/pictures/logo.png"
            alt="Logo"
            width={48}
            height={48}
            quality={100}
            priority
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Hamburger bar menu */}
      <div className="flex md:hidden w-full justify-end items-center">
        <Button
          size="lg"
          radius="sm"
          variant="flat"
          color="primary"
          isIconOnly
          endContent={<HamburgerIcon />}
          onPress={() => setDrawerOpen(true)}
        />

        <DrawerComponent
          size="xs"
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div className="flex flex-col gap-2">
            {dynamicMenuItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "flat" : "light"}
                  color={isActive ? "primary" : "default"}
                  // disabled={!userContext?.token && !isActive}
                  size="lg"
                  radius="sm"
                  startContent={item.icon}
                  className={`w-full justify-start text-left p-3 font-semibold
                    ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  onPress={() => handleNav(item.path)}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </DrawerComponent>
      </div>

      {/* Nav bar menu */}
      <NavbarContent
        className="hidden md:flex md:w-full gap-0 p-0"
        justify="end"
      >
        <div className="p-1 bg-gray-100 rounded-xl flex flex-row items-center ">
          {dynamicMenuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarItem key={item.name}>
                <Button
                  variant={isActive ? "solid" : "light"}
                  color={isActive ? "primary" : "default"}
                  size="md"
                  radius="sm"
                  // disabled={!userContext?.token && !isActive}
                  className={`font-semibold px-2 flex justify-center items-center gap-2 
                    ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  onPress={() => handleNav(item.path)}
                >
                  {isActive && item.icon}
                  {item.name}
                </Button>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>
    </HeroUINavbar>
  );
};
