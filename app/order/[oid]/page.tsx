"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { RequestOrder } from "@/interfaces/interfaces";
import Header from "@/components/Header";

const OrderActionPage = () => {
  const searchParams = useSearchParams();
  const item: RequestOrder = searchParams
    ? JSON.parse(searchParams.get("data") || "{}")
    : null;
  // console.log(item);

  return (
    <div className="w-full px-0">
      <Header title="Order Details" />

      {item &&
        Object.entries(item).map(([key, value]) => (
          <div key={key} className="mb-2">
            <strong>{key}:</strong> {String(value)}
          </div>
        ))}
    </div>
  );
};

export default OrderActionPage;
