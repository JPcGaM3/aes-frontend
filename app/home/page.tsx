"use client";

import Header from "@/components/Header";

import { useAuth } from "@/providers/AuthContext";

export default function HomePage() {
  const { userContext } = useAuth();

  console.log("User Context:", userContext);

  return (
    <div>
      <Header title="Home" subtitle={`Welcome to the home page`} />
    </div>
  );
}
