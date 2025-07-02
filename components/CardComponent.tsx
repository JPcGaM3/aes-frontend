"use client";

import React, { useCallback } from "react";
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";

import { CardComponentProps } from "@/interfaces/interfaces";
import { VerticalDotsIcon } from "@/utils/icons";
import { translateEnumValue } from "@/utils/functions";
import { clsx } from "clsx";

function getNestedValue(obj: any, path: string) {
  return path
    .split(".")
    .reduce(
      (acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined),
      obj
    );
}

export default function CardComponent<T extends { id: number | string }>({
  items,
  statusConfig,
  headerFields,
  bodyFields,
  actions,
  cardClassName = "flex flex-col gap-3 bg-white shadow-md rounded-lg min-w-64 h-full",
}: CardComponentProps<T>) {
  const renderCell = useCallback(
    (item: T) => (
      <div key={item.id} className={cardClassName}>
        {/* header */}
        <div className="px-4 text-left gap-1">
          <Chip
            size="sm"
            radius="sm"
            variant="flat"
            className="w-fit p-3 mt-4 mb-2 tracking-wide"
            color={statusConfig?.colorMap?.[(item as any).status] || "default"}
          >
            <span className="font-semibold">
              {translateEnumValue(
                (item as any).status,
                statusConfig?.translation || {}
              )}
            </span>
          </Chip>

          {headerFields?.map((field) => {
            const label = field.label
              ? field.label
              : translateEnumValue(field.key, field.labelTranslator || {});

            const nested = getNestedValue(item, field.key);
            const value =
              nested == null
                ? "N/A"
                : translateEnumValue(nested, field.valueTranslator || {});

            return (
              <div key={field.key} className={field.className || "w-fit"}>
                {label} : {value}
              </div>
            );
          })}
        </div>

        {/* body */}
        <div className="flex flex-col px-4 pb-1">
          {bodyFields.map((field) => {
            const label = field.label
              ? field.label
              : translateEnumValue(field.key, field.labelTranslator || {});

            let value;
            if (field.valueFunction) {
              value = field.valueFunction(item);
            } else {
              const nested = getNestedValue(item, field.key);
              value =
                nested == null
                  ? "N/A"
                  : translateEnumValue(nested, field.valueTranslator || {});
            }

            return (
              <div
                key={field.key}
                className={`flex flex-row items-center gap-2 ${
                  field.className || "text-gray-600"
                }`}
              >
                <div className="w-2/5">{label}</div>
                <div className={clsx(`${field.valueClassName} w-3/5`)}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        {actions && actions.length > 0 && (
          <div>
            <Divider />
            <div className="flex justify-between items-center gap-2 py-1 pl-4 pr-1">
              <div className="text-gray-500 text-sm">More actions.</div>

              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <div className="text-default-300">
                      <VerticalDotsIcon />
                    </div>
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="rounded-lg shadow-lg mt-1 min-w-40 p-1">
                  <div className="flex flex-col text-sm w-full">
                    {actions.map((action) => (
                      <Button
                        key={action.key}
                        variant="light"
                        size="md"
                        radius="sm"
                        startContent={action.icon}
                        className={`w-full justify-start text-left p-2 ${action.className || ""}`}
                        onPress={() =>
                          action.onClick && action.onClick({ item })
                        }
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    ),
    [statusConfig, headerFields, bodyFields, actions, cardClassName]
  );

  return (
    <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full h-full">
      {items.map((item) => renderCell(item))}
    </div>
  );
}
