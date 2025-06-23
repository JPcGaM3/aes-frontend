"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { useLoading } from "@/providers/LoadingContext";

const menuItems = [
  { name: "Home", path: "/" },
  { name: "Form", path: "/form" },
  { name: "Card", path: "/card" },
  { name: "Drawer", path: "/drawer" },
  { name: "Filter", path: "/filter" },
  { name: "Login", path: "/login" },
  { name: "Request", path: "/request" },
];

export const Navbar = () => {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleNav = (path: string) => {
    setIsLoading(true);
    router.push(path);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <HeroUINavbar
      className="shadow-md px-6"
      maxWidth="full"
      position="sticky"
      shouldHideOnScroll={false}
    >
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full gap-0"
        justify="end"
      >
        {menuItems.map((item) => (
          <NavbarItem key={item.name} className="hidden sm:flex">
            <Button
              variant="light"
              size="sm"
              radius="sm"
              className="font-semibold text-base px-4 py-6 text-inherit flex justify-center items-center"
              onPress={() => handleNav(item.path)}
            >
              {item.name}
            </Button>
          </NavbarItem>
        ))}
      </NavbarContent>
    </HeroUINavbar>
  );
};
