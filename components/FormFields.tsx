"use client";
import React from "react";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

import { EyeFilledIcon, EyeSlashFilledIcon } from "../utils/icons";

import { FormField, InputConfig } from "@/interfaces/interfaces";

function InputRenderer({ inputConfig }: { inputConfig: InputConfig }) {
  const commonProp = {
    name: inputConfig.name,
    label: inputConfig.label,
    labelPlacement: inputConfig.labelPlacement || "outside",
    placeholder: inputConfig.placeholder || `กรอก ${inputConfig.label}`,
    description: inputConfig.description || null,
    startContent: inputConfig.startContent || null,
    endContent: inputConfig.endContent || null,
    isRequired: inputConfig.isRequired || false,
    isInvalid: inputConfig.isInvalid || false,
    errorMessage: inputConfig.errorMessage || null,
    className: inputConfig.className || "",
  };

  switch (inputConfig.type) {
    case "text":
    case "email":
      return <Input {...commonProp} type={inputConfig.type} />;

    case "password": {
      const [isVisible, setIsVisible] = React.useState(false);
      const toggleVisibility = () => setIsVisible((v) => !v);

      return (
        <Input
          {...commonProp}
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              tabIndex={-1}
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-default-400 text-2xl pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />
      );
    }

    case "number":
      return (
        <NumberInput
          {...commonProp}
          max={inputConfig.max}
          min={inputConfig.min}
        />
      );

    case "dropdown":
      return (
        <Select
          {...commonProp}
          selectionMode={inputConfig.selectionMode || "single"}
        >
          {inputConfig.options.map((option, index) => (
            <SelectItem key={index}>{option.label}</SelectItem>
          ))}
        </Select>
      );
  }
}

const FormFields: React.FC<{ fields: FormField[] }> = ({ fields }) => (
  <>
    {fields.map((field, index) =>
      Array.isArray(field) ? (
        <div key={index} className="flex gap-2 w-full">
          {field.map((subField, subIndex) => (
            <InputRenderer
              key={`${index}-${subIndex}`}
              inputConfig={subField}
            />
          ))}
        </div>
      ) : (
        <InputRenderer key={index} inputConfig={field} />
      ),
    )}
  </>
);

export default FormFields;
