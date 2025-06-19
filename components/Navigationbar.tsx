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
  { name: "Table", path: "/table" },
  { name: "Card", path: "/card" },
  { name: "Form", path: "/form" },
  { name: "Login", path: "/login" },
  { name: "Order", path: "/order" },
  { name: "Drawer", path: "/drawer" },
];

export const Navbar = () => {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  const handleNav = (path: string) => {
    setIsLoading(true);

    setTimeout(() => {
      router.push(path);
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
              className="font-bold text-inherit flex justify-center items-center"
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
