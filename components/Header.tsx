import React from "react";
import { ClassValue, clsx } from "clsx";

interface HeaderProps {
  title: string;
  subtitle?: string;
  hasBorder?: boolean;
  className?: ClassValue;
  titleClassName?: ClassValue;
  subtitleClassName?: ClassValue;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  hasBorder = true,
  className = "w-full text-center flex flex-col",
  titleClassName = "text-2xl font-semibold text-gray-900",
  subtitleClassName = "mt-1 text-base text-gray-600",
  children,
}) => (
  <header className={clsx(className)}>
    <div className="flex flex-row justify-between align-middle w-full pt-3">
      <div className="w-full flex flex-col justify-center">
        <h2 className={clsx(titleClassName)}>{title}</h2>
        {subtitle && <p className={clsx(subtitleClassName)}>{subtitle}</p>}
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        {children}
      </div>
    </div>

    {hasBorder && <hr className="mt-4 border-gray-200" />}
  </header>
);

export default Header;
