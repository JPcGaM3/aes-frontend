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
  NavbarMenuToggle,
} from "@heroui/navbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { Button } from "@heroui/button";

import Image from "next/image";
import DrawerComponent from "./DrawerComponent";

import { getOperationAreas } from "@/libs/operationAreaAPI";

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
} from "@/utils/icons";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const { setIsLoading } = useLoading();
  const { userContext } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [operationAreas, setOperationAreas] = useState<any[]>([]);

  // TODO: core fetch function
  useEffect(() => {
    if (userContext.token) {
      const fetchOperationAreas = async ({ token }: { token: string }) => {
        try {
          const response = await getOperationAreas({ token });
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

  const handleNav = (path: string) => {
    setIsLoading(true);
    setIsMenuOpen(false);

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

  const operationOptions = operationAreas.map((area) => ({
    value: String(area.id),
    label: area.operation_area,
  }));

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
      <NavbarContent>
        {/* Logo */}
        <NavbarBrand className="h-full">
          <div className="relative h-10 w-10 flex items-center justify-center">
            <Image
              src="/pictures/logo.png"
              alt="Logo"
              fill
              quality={100}
              priority
              className="object-contain h-full w-full"
              sizes="(max-width: 768px) 48px, 100vw"
            />
          </div>
          <p className="font-bold text-inherit">AE_Service</p>
        </NavbarBrand>

        <div className="flex md:hidden w-full justify-end items-center">
          <Button
            size="lg"
            radius="sm"
            variant="flat"
            color="primary"
            isIconOnly
            endContent={isMenuOpen ? <CancelIcon /> : <HamburgerIcon />}
            onPress={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
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

    // <HeroUINavbar
    //   maxWidth="full"
    //   position="sticky"
    //   shouldHideOnScroll={false}
    //   className="shadow-md p-0 h-18 z-[100] flex items-center"
    //   classNames={{
    //     wrapper: "px-3 py-2",
    //   }}
    // >
    //   {/* Logo */}
    //   <NavbarBrand>
    //     <div className="flex items-center justify-center h-full w-auto">
    //       <div className="w-12 h-12 flex items-center justify-center">
    //         <Image
    //           src="/pictures/logo.png"
    //           alt="Logo"
    //           width={48}
    //           height={48}
    //           quality={100}
    //           priority
    //           className="object-contain w-full h-full"
    //         />
    //       </div>
    //     </div>
    //   </NavbarBrand>

    //   <NavbarContent className="w-full gap-2 p-0 items-center" justify="end">
    //     {/* Dropdown menu - only show on desktop */}
    //     <div className="hidden md:flex">
    //       <Popover placement="bottom-end">
    //         <PopoverTrigger>
    //           <Button isIconOnly size="sm" variant="light">
    //             <div className="text-default-300">
    //               <VerticalDotsIcon />
    //             </div>
    //           </Button>
    //         </PopoverTrigger>

    //         <PopoverContent className="rounded-lg shadow-lg mt-1 min-w-40 p-1">
    //           <div className="flex flex-col text-sm w-full">
    //             {operationOptions.length > 0 ? (
    //               operationOptions.map((option) => (
    //                 <Button
    //                   key={option.value}
    //                   variant="light"
    //                   size="md"
    //                   radius="sm"
    //                   className={"w-full justify-start text-left p-2"}
    //                   onPress={() => console.log(option.value)}
    //                 >
    //                   {option.label}
    //                 </Button>
    //               ))
    //             ) : (
    //               <div className="text-gray-400 p-2 text-center">
    //                 No options available
    //               </div>
    //             )}
    //           </div>
    //         </PopoverContent>
    //       </Popover>
    //     </div>

    //     {/* Hamburger bar menu */}
    //     <div className="flex md:hidden w-full justify-end items-center">
    //       <Button
    //         size="lg"
    //         radius="sm"
    //         variant="flat"
    //         color="primary"
    //         isIconOnly
    //         endContent={<HamburgerIcon />}
    //         onPress={onOpen}
    //       />

    //       {isOpen && (
    //         <DrawerComponent
    //           size="xs"
    //           placement="top"
    //           isOpen={isOpen}
    //           onClose={onClose}
    //         >
    //           <div className="flex flex-col gap-0 p-[6px] pt-[72px]">
    //             {/* Optionally, show operation options in drawer for mobile */}
    //             {operationOptions.length > 0 && (
    //               <div className="mb-2">
    //                 <div className="font-semibold text-gray-600 px-2 pb-1">
    //                   Operation Areas
    //                 </div>
    //                 {operationOptions.map((option) => (
    //                   <Button
    //                     key={option.value}
    //                     variant="light"
    //                     size="md"
    //                     radius="sm"
    //                     className={"w-full justify-start text-left p-2"}
    //                     onPress={() => console.log(option.value)}
    //                   >
    //                     {option.label}
    //                   </Button>
    //                 ))}
    //               </div>
    //             )}
    //             {dynamicMenuItems.map((item) => {
    //               const isActive = pathname === item.path;

    //               return (
    //                 <Button
    //                   key={item.name}
    //                   variant={isActive ? "flat" : "light"}
    //                   color={isActive ? "primary" : "default"}
    //                   disabled={!userContext?.token && !isActive}
    //                   size="md"
    //                   radius="sm"
    //                   startContent={item.icon}
    //                   className={`w-full justify-start text-left p-3 font-semibold
    //               ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}
    //               `}
    //                   onPress={() => handleNav(item.path)}
    //                 >
    //                   {item.name}
    //                 </Button>
    //               );
    //             })}
    //           </div>
    //         </DrawerComponent>
    //       )}
    //     </div>

    //     {/* Nav bar menu */}
    //     <div className="hidden md:flex p-1 bg-gray-100 rounded-xl flex-row items-center ">
    //       {dynamicMenuItems.map((item) => {
    //         const isActive = pathname === item.path;

    //         return (
    //           <NavbarItem key={item.name}>
    //             <Button
    //               variant={isActive ? "solid" : "light"}
    //               color={isActive ? "primary" : "default"}
    //               size="md"
    //               radius="sm"
    //               disabled={!userContext?.token && !isActive}
    //               className={`font-semibold px-2 flex justify-center items-center gap-2
    //                 ${!userContext?.token && !isActive ? "opacity-50 cursor-not-allowed" : ""}`}
    //               onPress={() => handleNav(item.path)}
    //             >
    //               {isActive && item.icon}
    //               {item.name}
    //             </Button>
    //           </NavbarItem>
    //         );
    //       })}
    //     </div>
    //   </NavbarContent>
    // </HeroUINavbar>
  );
}
