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
} from "@heroui/react";

import { translateEnumValue } from "@/utils/functions";
import { CardComponentProps } from "@/interfaces/interfaces";
import { VerticalDotsIcon } from "@/utils/icons";

export const CardComponent = <T extends { id: number | string }>({
  items,
  statusConfig,
  headerFields,
  bodyFields,
  actions,
  cardClassName = "flex flex-col gap-1 bg-white shadow-md rounded-lg min-w-64 h-full",
}: CardComponentProps<T>) => {
  const renderCell = useCallback(
    (item: T) => (
      <div key={item.id} className={cardClassName}>

        {/* header */}
        <div className="px-4 text-left">
          {statusConfig && (item as any)[statusConfig.key] && (
            <Chip
              className="w-fit capitalize p-3 mt-4 mb-2"
              color={
                statusConfig.colorMap[
                  ((item as any)[statusConfig.key] ||
                    statusConfig.defaultValue) as string
                ]
              }
              size="sm"
              variant="flat"
              radius="sm"
            >
              {statusConfig.translation
                ? translateEnumValue(
                    statusConfig.defaultValue as any,
                    statusConfig.translation
                  )
                : statusConfig.defaultValue}
            </Chip>
          )}

          {headerFields?.map((field) => {
            const value = (item as any)[field.key];
            const label = field.label;

            return (
              <div key={field.key} className={field.className || "w-fit"}>
                {label} : {value}
              </div>
            );
          })}
        </div>

        {/* body */}
        <div className="flex flex-col px-4">
          {bodyFields.map((field) => {
            const value = (item as any)[field.key];
            const label = field.label;

            if (value === undefined || value === null) {
              return null;
            }

            return (
              <div
                key={field.key}
                className={`flex flex-row items-center gap-2 ${
                  field.className || "text-gray-600"
                }`}
              >
                <div className="w-1/4 font-medium">{label}</div>
                <div className="w-3/4 break-words">: {value}</div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        {actions && actions.length > 0 && (
          <div className="pt-3">
            <Divider />
            <div className="flex justify-between items-center gap-2 py-1 pl-4 pr-1">
              <div className="text-gray-500 text-sm">More actions.</div>

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
};
