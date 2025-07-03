import { useState } from "react";

import { InputRendererProps } from "@/interfaces/props";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/utils/icons";
import { DropdownOption } from "@/interfaces/interfaces";
import { DatePicker, DateRangePicker, Select, SelectItem } from "@heroui/react";

export default function InputRenderer({
  type,
  value,
  commonProps,
  onValueChange,
}: InputRendererProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((state) => !state);

  switch (type) {
    case "text":
    case "email": {
      return (
        <Input
          {...commonProps}
          type={type}
          value={value}
          onValueChange={
            onValueChange
              ? (v) => onValueChange(commonProps.name, v)
              : undefined
          }
        />
      );
    }

    case "textarea": {
      return (
        <Textarea
          {...commonProps}
          value={value}
          onValueChange={
            onValueChange
              ? (v) => onValueChange(commonProps.name, v)
              : undefined
          }
        />
      );
    }

    case "number": {
      return (
        <Textarea
          {...commonProps}
          value={value}
          onValueChange={
            onValueChange
              ? (v) => onValueChange(commonProps.name, v)
              : undefined
          }
        />
      );
    }

    case "password": {
      return (
        <Input
          {...commonProps}
          type={isVisible ? "text" : "password"}
          value={value}
          endContent={
            <Button
              variant="light"
              size="sm"
              isIconOnly
              color="default"
              onPress={toggleVisibility}
              endContent={
                isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />
              }
            />
          }
          onValueChange={
            onValueChange
              ? (v) => onValueChange(commonProps.name, v)
              : undefined
          }
        />
      );
    }

    case "dropdown": {
      const optionType = typeof commonProps.options[0].value;

      return (
        <Select
          {...commonProps}
          selectedKeys={
            value !== undefined && value !== null && value !== ""
              ? new Set([String(value)])
              : new Set()
          }
          onSelectionChange={
            onValueChange
              ? (keys) => {
                  let selected = Array.isArray(keys)
                    ? keys[0]
                    : keys instanceof Set
                      ? Array.from(keys)[0]
                      : keys;

                  let value = selected;
                  if (
                    optionType === "number" &&
                    selected !== undefined &&
                    selected !== null &&
                    selected !== ""
                  ) {
                    const num = Number(selected);
                    value = isNaN(num) ? selected : num;
                  }

                  onValueChange(commonProps.name, value);
                }
              : undefined
          }
        >
          {commonProps.options.map((option: DropdownOption) => (
            <SelectItem key={String(option.value)}>{option.label}</SelectItem>
          ))}
        </Select>
      );
    }

    case "date": {
      return (
        <DatePicker
          {...commonProps}
          value={value}
          showMonthAndYearPickers
          onValueChange={
            onValueChange
              ? (v: Date) =>
                  onValueChange(commonProps.name, v.toLocaleDateString())
              : undefined
          }
        />
      );
    }

    case "date-range": {
      return (
        <DateRangePicker
          {...commonProps}
          value={value}
          showMonthAndYearPickers
          onValueChange={
            onValueChange
              ? (v: [Date, Date]) =>
                  onValueChange(
                    commonProps.name,
                    v && v[0] && v[1]
                      ? `${v[0].toLocaleDateString()}|${v[1].toLocaleDateString()}`
                      : ""
                  )
              : undefined
          }
        />
      );
    }
  }
}
