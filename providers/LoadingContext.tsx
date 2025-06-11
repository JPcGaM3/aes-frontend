"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CircularProgress } from "@heroui/react";

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
        <div className="z-50 fixed inset-0 flex flex-col justify-center items-center gap-2 max-w-full">
          <CircularProgress
            className=""
            color={colors[colorIndex as number] as ColorType}
            label="Loading..."
            size="lg"
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
