import { useCallback, useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries && entries.length > 0) {
        setWidth(entries[0].contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const getVisibleMonths = () => {
    console.log("getVisibleMonths called with width:", width);

    if (width < 500) {
      return 1;
    }
    if (width < 750) {
      return 2;
    }
    if (width < 1000) {
      return 3;
    }

    return 4;
  };

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
          onValueChange={onValueChange ? handleUnifiedValueChange : undefined}
          endContent={
            <Button
              isIconOnly
              size="sm"
              radius="full"
              variant="light"
              onPress={() => setIsVisible((state) => !state)}
              className="p-0 -mx-2 text-2xl pointer-events-none text-default-400"
            >
              {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
            </Button>
          }
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
            popoverContent: "rounded-lg p-0",
          }}
        >
          {(commonProps.options || []).length === 0 ? (
            <SelectItem key="no-option" isDisabled>
              No option.
            </SelectItem>
          ) : (
            (commonProps.options || []).map((option: DropdownOption) => {
              const isSelected =
                value !== undefined &&
                value !== null &&
                value !== "" &&
                String(option.value) === String(value);

              return (
                <SelectItem
                  key={String(option.value)}
                  classNames={{
                    base: `rounded-md data-[hover]:bg-default/40 ${isSelected ? "bg-primary/20" : ""}`,
                  }}
                >
                  {option.label}
                </SelectItem>
              );
            })
          )}
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
        <div ref={containerRef}>
          <DateRangePicker
            {...commonProps}
            value={value}
            showMonthAndYearPickers
            visibleMonths={getVisibleMonths()}
            onChange={onValueChange ? handleUnifiedValueChange : undefined}
          />
        </div>
      );
    }
  }
}
