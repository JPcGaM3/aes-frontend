"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { DatePicker, DateRangePicker, NumberInput } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";

import { EyeFilledIcon, EyeSlashFilledIcon } from "../utils/icons";

import { FormField, InputConfig } from "@/interfaces/interfaces";

interface FormFieldsProps {
  fields: FormField[];
  values?: Record<string, any>;
  onValueChange?: (name: string, value: string) => void;
}

interface InputRendererProps {
  inputConfig: InputConfig;
  onValueChange?: (name: string, value: string) => void;
  value?: any;
}

export default function FormFields({
  fields,
  onValueChange,
  values = {},
}: FormFieldsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {fields.map((field, index) =>
        Array.isArray(field) ? (
          <div key={index} className="flex flex-row gap-2 w-full">
            {field.map((subField, subIndex) => (
              <InputRenderer
                key={`${index}-${subIndex}`}
                inputConfig={subField}
                onValueChange={onValueChange}
                value={values[subField.name]}
              />
            ))}
          </div>
        ) : (
          <InputRenderer
            key={index}
            inputConfig={field}
            onValueChange={onValueChange}
            value={values[field.name]}
          />
        )
      )}
    </div>
  );
}

function InputRenderer({
  inputConfig,
  onValueChange,
  value,
}: InputRendererProps) {
  const commonProp: any = {
    name: inputConfig.name,
    label: inputConfig.label,
    labelPlacement: inputConfig.labelPlacement || "outside",
    hasPlaceholder: inputConfig.hasPlaceholder || true,
    placeholder: inputConfig.hasPlaceholder === false
      ? undefined
      : inputConfig.placeholder || `กรุณากรอก ${inputConfig.label}`,
    description: inputConfig.description || null,
    startContent: inputConfig.startContent || null,
    endContent: inputConfig.endContent || null,
    isRequired: inputConfig.isRequired || false,
    isInvalid: inputConfig.isInvalid || false,
    errorMessage: inputConfig.errorMessage || null,
    className: `${inputConfig.className || ""} break-words`,
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((state) => !state);

  switch (inputConfig.type) {
    case "text":
    case "email":
      return (
        <Input
          {...commonProp}
          radius="sm"
          type={inputConfig.type}
          onValueChange={
            onValueChange
              ? (v) => onValueChange(inputConfig.name, v)
              : undefined
          }
          value={value}
        />
      );

    case "password": {
      return (
        <Input
          {...commonProp}
          radius="sm"
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
          value={value}
        />
      );
    }

    case "number":
      return (
        <NumberInput
          {...commonProp}
          radius="sm"
          max={inputConfig.max}
          min={inputConfig.min}
          value={value}
        />
      );

    case "dropdown":
      return (
        <Select
          {...commonProp}
          radius="sm"
          selectionMode={inputConfig.selectionMode || "single"}
          onSelectionChange={
            onValueChange
              ? (keys) => {
                  let value = Array.isArray(keys)
                    ? keys[0]
                    : keys instanceof Set
                      ? Array.from(keys)[0]
                      : keys;
                  onValueChange(inputConfig.name, value);
                }
              : undefined
          }
          selectedKeys={value ? new Set([value]) : new Set()}
        >
          {inputConfig.options.map((option, index) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      );

    case "date":
      return (
        <DatePicker
          {...commonProp}
          radius="sm"
          showMonthAndYearPickers
          value={value}
        />
      );

    case "date-range": {
      commonProp["aria-label"] =
        inputConfig.label || inputConfig.name || "Date range";

      return (
        <DateRangePicker
          {...commonProp}
          radius="sm"
          showMonthAndYearPickers
          value={value}
        />
      );
    }
  }
}
