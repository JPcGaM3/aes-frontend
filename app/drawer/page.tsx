// "use client";
// import React, { useEffect, useState } from "react";
// import { Button, useDisclosure } from "@heroui/react";

// import { User } from "@/interfaces/interfaces";
// import { mock_requestorder, mock_taskorders, mock_users } from "@/utils/mock";
// import { useLoading } from "@/providers/LoadingContext";
// import { DrawerComponent } from "@/components/DrawerComponent";
// import { ColorType } from "@/types";
// import { AccordionComponent } from "@/components/AccordionComponent";

// interface ActionConfig {
//   key: string;
//   color: ColorType;
//   label: string;
//   onClick?: (item: any) => void;
// }

// function Drawer() {
//   const { setIsLoading } = useLoading();
//   const [users, setUsers] = useState<User[]>([]);
//   const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);

//   useEffect(() => {
//     setIsLoading(true);

//     const fetchData = () => {
//       setTimeout(() => {
//         setUsers(mock_users);
//         setIsLoading(false);
//       }, 3000);
//     };

//     fetchData();

//     const intervalId = setInterval(() => {
//       fetchData();
//     }, 10000);

//     return () => clearInterval(intervalId);
//   }, [setIsLoading]);

//   const handleView = (user: User) => {
//     console.log(`Viewing user: ${user.fullname}`);
//   };

//   const handleEdit = (user: User) => {
//     console.log(`Editing user: ${user.fullname}`);
//   };

//   const handleDelete = (user: User) => {
//     setUserToDelete(user);
//     onOpen();
//   };

//   function confirmDelete(): void {
//     if (userToDelete) {
//       console.log(`Deleting user: ${userToDelete.fullname}`);
//       setUsers(users.filter((u) => u.id !== userToDelete.id));
//     }
//     setUserToDelete(null);
//     onClose();
//   }

//   const actions: ActionConfig[] = [
//     {
//       key: "Edit",
//       color: "warning",
//       label: "Edit",
//       onClick: onClose,
//     },
//     {
//       key: "Assign",
//       color: "primary",
//       label: "Assign",
//       onClick: onClose,
//     },
//   ];

//   return (
//     <>
//       <Button onPress={onOpen}>Open Drawer</Button>
//       <DrawerComponent
//         actions={actions}
//         drawerTitle="Drawer"
//         isOpen={isOpen}
//         onClose={onClose}
//         onOpen={onOpen}
//         onOpenChange={onOpenChange}
//       >
//         <AccordionComponent
//           requestOrder={mock_requestorder}
//           taskOrders={mock_taskorders}
//         />
//       </DrawerComponent>
//     </>
//   );
// }

// export default Drawer;

"use client";

import { Button, useDisclosure } from "@heroui/react";

import DrawerComponent from "@/components/DrawerComponent";

export default function DrawerPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Open Drawer</Button>
      <DrawerComponent isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}
