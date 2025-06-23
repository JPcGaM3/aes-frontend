import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  className = "mb-6 w-full text-center flex flex-col",
  children,
}) => (
  <header className={className}>
    <div className="flex flex-row justify-between align-middle w-full">
      <div className="w-full flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-base text-gray-600">{subtitle}</p>}
      </div>

      <div className="flex flex-row justify-center items-center gap-2">
        {children}
      </div>
    </div>

    <hr className="mt-4 border-gray-200" />
  </header>
);

export default Header;
