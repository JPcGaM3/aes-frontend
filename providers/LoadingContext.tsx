"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

import { ColorType } from "@/types";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colorIndex, setColorIndex] = useState<number>(0);

  const colors = ["primary", "secondary", "success", "warning", "danger"];

  useEffect(() => {
    if (!isLoading) return;

    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 300);

    return () => clearInterval(intervalId);
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1rem",
              padding: "2rem 3rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Spinner
              classNames={{ label: "text-foreground mt-4" }}
              color={colors[colorIndex as number] as ColorType}
              label="Loading..."
              size="lg"
              variant="wave"
            />
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
