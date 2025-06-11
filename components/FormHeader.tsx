import React from "react";

interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <header className="mb-6 w-full">
    <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-base text-gray-600">{subtitle}</p>
    )}
    <hr className="mt-4 border-gray-200" />
  </header>
);

export default FormHeader;
