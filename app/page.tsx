"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthContext";
import { useLoading } from "@/providers/LoadingContext";

export default function Home() {
    const router = useRouter();
    const { userContext } = useAuth();
    const { setIsLoading } = useLoading();

    useEffect(() => {
        setIsLoading(true);

        {
            userContext.token
                ? router.replace("/home")
                : router.replace("/login");
        }
    }, [userContext, router]);

    return null;
}
