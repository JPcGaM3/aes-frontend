"use client";
import { Button } from "@heroui/react";
import React, { useState } from "react";

import { UserIcon } from "@/utils/icon";

function Login() {
  const [isClick, setClick] = useState(0);

  const ClickLogin = () => setClick(isClick + 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex font-bold text-2xl text-center">Welcome to AES</div>
      <div className="flex justify-center items-center gap-4">
        <Button
          color="primary"
          startContent={<UserIcon height={20} size={24} width={60} />}
          variant="bordered"
          onPress={() => {
            ClickLogin();
          }}
        >
          MITR Portal
        </Button>
      </div>
    </div>
  );
}

export default Login;
