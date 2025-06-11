"use client";
import React, { useCallback } from "react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { VerticalDotsIcon } from "./TableComponent";

import { ColorType } from "@/types";
import { translateEnumValue } from "@/utils/functions";

interface StatusConfig {
  key: string;
  defaultValue?: string;
  colorMap: Record<string, ColorType>;
  translation?: Record<string, string>;
}

interface FieldConfig {
  key: string;
  label?: string;
  formatter?: (value: any) => string;
  className?: string;
  translation?: Record<string, string>;
}

interface ActionConfig {
  key: string;
  label: string;
  onClick?: (item: any) => void;
}

interface CardComponentProps<T> {
  items: T[];
  statusConfig?: StatusConfig;
  headerFields?: FieldConfig[];
  bodyFields: FieldConfig[];
  actions?: ActionConfig[];
  cardClassName?: string;
}

export const CardComponent = <T extends { id: number | string }>({
  items,
  statusConfig,
  headerFields,
  bodyFields,
  actions,
  cardClassName = "flex flex-col gap-2 bg-white shadow-md p-4 rounded-lg min-w-64 h-full",
}: CardComponentProps<T>) => {
  const renderCell = useCallback(
    (item: T) => (
      <div key={item.id} className={cardClassName}>
        {/* header */}
        {statusConfig && (item as any)[statusConfig.key] && (
          <Chip
            className="w-fit capitalize"
            color={
              statusConfig.colorMap[
                ((item as any)[statusConfig.key] ||
                  statusConfig.defaultValue) as string
              ]
            }
            size="sm"
            variant="flat"
          >
            {statusConfig.translation
              ? translateEnumValue(
                  (item as any)[statusConfig.key] ||
                    statusConfig.defaultValue ||
                    "",
                  statusConfig.translation,
                )
              : (item as any)[statusConfig.key] || statusConfig.defaultValue}
          </Chip>
        )}

        {headerFields?.map((field) => (
          <div key={field.key} className={field.className || "w-fit"}>
            {field.formatter
              ? field.formatter((item as any)[field.key])
              : field.translation
                ? translateEnumValue(
                    (item as any)[field.key],
                    field.translation,
                  )
                : (item as any)[field.key]}
          </div>
        ))}

        {/* body */}
        <div className="flex flex-col">
          {bodyFields.map((field) => {
            const value = (item as any)[field.key];

            if (value === undefined || value === null) return null;

            return (
              <div
                key={field.key}
                className={field.className || "text-gray-600"}
              >
                {field.label && (
                  <span className="font-medium">{field.label}: </span>
                )}
                {field.formatter
                  ? field.formatter(value)
                  : field.translation
                    ? translateEnumValue(value, field.translation)
                    : value}
              </div>
            );
          })}
        </div>

        {/* footer */}
        {actions && actions.length > 0 && (
          <div className="flex justify-end gap-2 mt-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <div className="text-default-300">
                    <VerticalDotsIcon />
                  </div>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {actions.map((action) => (
                  <DropdownItem
                    key={action.key}
                    onClick={() => action.onClick && action.onClick(item)}
                  >
                    {action.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </div>
    ),
    [statusConfig, headerFields, bodyFields, actions, cardClassName],
  );

  return (
    // <div className="flex flex-wrap justify-between items-center gap-8 w-full h-full">
    <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full">
      {items && items.length > 0 ? (
        items.map((item) => renderCell(item))
      ) : (
        <div className="text-gray-500">No items to display</div>
      )}
    </div>
  );
};
