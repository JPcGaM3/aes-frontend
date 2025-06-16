import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <header className="mb-6 w-full text-center">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {subtitle && <p className="mt-1 text-base text-gray-600">{subtitle}</p>}
    <hr className="mt-4 border-gray-200" />
  </header>
);

export default Header;
