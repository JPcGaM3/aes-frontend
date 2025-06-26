"use client";

import React, { useState } from "react";

import { FormField, InputConfig } from "@/interfaces/interfaces";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../utils/icons";

import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker, DateRangePicker, NumberInput } from "@heroui/react";
import { translateEnumValue } from "@/utils/functions";

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
  const label = inputConfig.label
    ? translateEnumValue(inputConfig.label, inputConfig.translator || {})
    : translateEnumValue(inputConfig.name, inputConfig.translator || {});

  const placeholder =
    inputConfig.hasPlaceholder === false
      ? undefined
      : inputConfig.placeholder ||
        (inputConfig.type === "dropdown"
          ? `โปรดเลือก ${label}`
          : `โปรดกรอก ${label}`);

  const commonProp: any = {
    name: inputConfig.name,
    label: label,
    labelPlacement: inputConfig.labelPlacement || "outside",
    hasPlaceholder: inputConfig.hasPlaceholder || true,
    placeholder: placeholder,
    description: inputConfig.description || null,
    startContent: inputConfig.startContent || null,
    endContent: inputConfig.endContent || null,
    isRequired: inputConfig.isRequired || false,
    isInvalid: inputConfig.isInvalid || false,
    errorMessage: inputConfig.errorMessage || null,
    className: `${inputConfig.className || ""} break-all`,
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((state) => !state);

  const getControlledValue = (type: string, value: any) => {
    switch (type) {
      case "text":
      case "email":
      case "password":
      case "textarea":
        return value ?? "";

      case "number":
        return value ?? "";

      case "dropdown":
        return value ?? "";

      case "date":
      case "date-range":
        return value ?? null;

      default:
        return value;
    }
  };

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
          value={getControlledValue(inputConfig.type, value)}
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
          value={getControlledValue(inputConfig.type, value)}
        />
      );
    }

    case "textarea":
      return (
        <Textarea
          {...commonProp}
          radius="sm"
          onValueChange={
            onValueChange
              ? (v) => onValueChange(inputConfig.name, v)
              : undefined
          }
          value={getControlledValue(inputConfig.type, value)}
        />
      );

    case "number":
      return (
        <NumberInput
          {...commonProp}
          radius="sm"
          max={inputConfig.max}
          min={inputConfig.min}
          value={getControlledValue(inputConfig.type, value)}
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
          selectedKeys={
            getControlledValue(inputConfig.type, value)
              ? new Set([getControlledValue(inputConfig.type, value)])
              : new Set()
          }
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
          value={getControlledValue(inputConfig.type, value)}
          showMonthAndYearPickers
        />
      );

    case "date-range": {
      commonProp["aria-label"] =
        inputConfig.label || inputConfig.name || "Date range";

      return (
        <DateRangePicker
          {...commonProp}
          radius="sm"
          value={getControlledValue(inputConfig.type, value)}
          showMonthAndYearPickers
        />
      );
    }
  }
}
