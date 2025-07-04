import { useCallback, useState } from "react";

import { InputRendererProps } from "@/interfaces/props";

import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/utils/icons";
import { DropdownOption } from "@/interfaces/interfaces";
import {
  CalendarDate,
  DatePicker,
  DateRangePicker,
  NumberInput,
  Select,
  SelectItem,
} from "@heroui/react";

export default function InputRenderer({
  type,
  value,
  commonProps,
  onValueChange,
}: InputRendererProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleUnifiedValueChange = useCallback(
    (v: any) => {
      if (!onValueChange) return;

      switch (type) {
        case "date": {
          if (v as CalendarDate) {
            onValueChange(commonProps.name, v);
          } else {
            onValueChange(commonProps.name, v);
          }

          break;
        }

        case "date-range": {
          if (Array.isArray(v) && v[0] && v[1]) {
            onValueChange(
              commonProps.name,
              `${v[0].toISOString()}|${v[1].toISOString()}`
            );
          } else {
            onValueChange(commonProps.name, "");
          }

          break;
        }

        case "dropdown": {
          const optionType =
            commonProps.options && commonProps.options.length > 0
              ? typeof commonProps.options[0].value
              : "string";

          let selected = Array.isArray(v)
            ? v[0]
            : v instanceof Set
              ? Array.from(v)[0]
              : v;

          let selectedValue = selected;
          if (
            optionType === "number" &&
            selected !== undefined &&
            selected !== null &&
            selected !== ""
          ) {
            const num = Number(selected);
            selectedValue = isNaN(num) ? selected : num;
          }

          onValueChange(commonProps.name, selectedValue);
          break;
        }

        default: {
          onValueChange(commonProps.name, v);
        }
      }
    },
    [onValueChange, commonProps.name, type, commonProps.options]
  );

  switch (type) {
    case "text":
    case "email": {
      return (
        <Input
          {...commonProps}
          type={type}
          value={value}
          onValueChange={onValueChange ? handleUnifiedValueChange : undefined}
        />
      );
    }

    case "textarea": {
      return (
        <Textarea
          {...commonProps}
          minRows={commonProps.minRows || 3}
          value={value}
          onValueChange={onValueChange ? handleUnifiedValueChange : undefined}
        />
      );
    }

    case "number": {
      return (
        <NumberInput
          {...commonProps}
          value={value}
          onValueChange={onValueChange ? handleUnifiedValueChange : undefined}
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
              onPress={() => setIsVisible((state) => !state)}
              endContent={
                isVisible ? <EyeFilledIcon /> : <EyeSlashFilledIcon />
              }
            />
          }
          onValueChange={onValueChange ? handleUnifiedValueChange : undefined}
        />
      );
    }

    case "dropdown": {
      return (
        <Select
          {...commonProps}
          selectedKeys={
            value !== undefined && value !== null && value !== ""
              ? new Set([String(value)])
              : new Set()
          }
          onSelectionChange={
            onValueChange ? handleUnifiedValueChange : undefined
          }
          classNames={{
            ...commonProps.classNames,
            popoverContent: "rounded-lg p-0"
          }}
        >
          {(commonProps.options || []).map((option: DropdownOption) => (
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
          onChange={onValueChange ? handleUnifiedValueChange : undefined}
        />
      );
    }

    case "date-range": {
      return (
        <DateRangePicker
          {...commonProps}
          value={value}
          showMonthAndYearPickers
          onChange={onValueChange ? handleUnifiedValueChange : undefined}
        />
      );
    }
  }
}
