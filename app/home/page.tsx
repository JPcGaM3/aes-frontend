"use client";

import Header from "@/components/Header";

import { useAuth } from "@/providers/AuthContext";

export default function HomePage() {
  const { userContext } = useAuth();

  return (
    <div>
      <Header title="Home" subtitle={`Welcome to the home page, user ${userContext?.id}`} />
    </div>
  );
}
