"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

export default function Home() {
  const router = useRouter();
  const { userContext } = useAuth();
  const { setIsLoading } = useLoading();

  React.useEffect(() => {
    setIsLoading(true);
    
    { userContext.id 
      ? router.replace("/home")
      : router.replace("/login");
    }
  }, [router]);

  return null;
}
