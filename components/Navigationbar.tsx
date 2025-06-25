"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLoading } from "@/providers/LoadingContext";

import { Button } from "@heroui/button";
import Image from "next/image";
import DrawerComponent from "./DrawerComponent";

import {
  HomeIcon,
  FormIcon,
  CardIcon,
  DrawerIcon,
  LoginIcon,
  RequestIcon,
  HamburgerIcon,
} from "@/utils/icons";

const menuItems = [
  { name: "Home", path: "/", icon: <HomeIcon /> },
  { name: "Form", path: "/form", icon: <FormIcon /> },
  { name: "Card", path: "/card", icon: <CardIcon /> },
  { name: "Drawer", path: "/drawer", icon: <DrawerIcon /> },
  { name: "Login", path: "/login", icon: <LoginIcon /> },
  { name: "Request", path: "/request", icon: <RequestIcon /> },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoading } = useLoading();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (path: string) => {
    setIsLoading(true);
    setDrawerOpen(false);

    router.push(path);
  };

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
            {menuItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Button
                  key={item.name}
                  variant={isActive ? "flat" : "light"}
                  color={isActive ? "primary" : "default"}
                  size="lg"
                  radius="sm"
                  className="w-full justify-start text-left flex gap-4 items-center p-3 font-semibold"
                  onPress={() => handleNav(item.path)}
                >
                  {item.icon}
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
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <NavbarItem key={item.name}>
                <Button
                  variant={isActive ? "solid" : "light"}
                  color={isActive ? "primary" : "default"}
                  size="md"
                  radius="sm"
                  className="font-semibold px-2 flex justify-center items-center gap-2"
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
