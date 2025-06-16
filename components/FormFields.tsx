"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

import { EyeFilledIcon, EyeSlashFilledIcon } from "../utils/icons";

import { FormField, InputConfig } from "@/interfaces/interfaces";

interface FormFieldsProps {
  fields: FormField[];
  onValueChange?: (name: string, value: string) => void;
}

function InputRenderer({
  inputConfig,
  onValueChange,
}: {
  inputConfig: InputConfig;
  onValueChange?: (name: string, value: string) => void;
}) {
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

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((state) => !state);

  switch (inputConfig.type) {
    case "text":
    case "email":
      return (
        <Input
          {...commonProp}
          type={inputConfig.type}
          onValueChange={
            onValueChange
              ? (v) => onValueChange(inputConfig.name, v)
              : undefined
          }
        />);

    case "password": {
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
          onValueChange={
            onValueChange
              ? (v) => onValueChange(inputConfig.name, v)
              : undefined
          }
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

const FormFields: React.FC<FormFieldsProps> = ({ fields, onValueChange }) => (
  <>
    {fields.map((field, index) =>
      Array.isArray(field) ? (
        <div key={index} className="flex gap-2 w-full">
          {field.map((subField, subIndex) => (
            <InputRenderer
              key={`${index}-${subIndex}`}
              inputConfig={subField}
              onValueChange={onValueChange}
            />
          ))}
        </div>
      ) : (
        <InputRenderer
          key={index}
          inputConfig={field}
          onValueChange={onValueChange}
        />
      )
    )}
  </>
);

export default FormFields;
