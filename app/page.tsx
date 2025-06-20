"use client";

import Header from "@/components/Header";
import React from "react";
import { useAuth } from "@/providers/AuthContext";

export default function Home() {
  const { userContext } = useAuth();

  return (
    <section className="flex flex-col justify-center items-center py-8 md:py-10">
      <Header title="Homepage" subtitle={`Welcome to the homepage, user ${userContext?.id}`} />
    </section>
  );
}
