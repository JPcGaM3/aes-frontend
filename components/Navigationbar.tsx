import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";

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
  return (
    <HeroUINavbar
      className="shadow-md px-6"
      // isBordered={true}
      maxWidth="full"
      position="sticky"
      shouldHideOnScroll={false}
    >
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {menuItems.map((item) => (
          <NavbarItem key={item.name} className="hidden sm:flex gap-8">
            <NextLink
              className="flex justify-start items-center gap-1"
              href={item.path}
            >
              <p className="font-bold text-inherit">{item.name}</p>
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>
    </HeroUINavbar>
  );
};
