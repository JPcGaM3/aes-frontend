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
import { VerticalDotsIcon } from "@/utils/icons";
import { CardComponentProps } from "@/interfaces/interfaces";

export const CardComponent = <T extends { id: number | string }>({
  items,
  statusConfig,
  headerFields,
  bodyFields,
  actions,
  cardClassName = "flex flex-col gap-2 bg-white shadow-md rounded-lg min-w-64 h-full",
}: CardComponentProps<T>) => {
  const renderCell = useCallback(
    (item: T) => (
      <div key={item.id} className={cardClassName}>
        {/* header */}
        <div className="px-4 py-2 text-left">
          {statusConfig && (item as any)[statusConfig.key] && (
            <Chip
              className="w-fit capitalize p-3 my-3"
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

          {headerFields?.map((field) => {
            const value = (item as any)[field.key];
            // Use translation map for label and value if available
            const label =
              field.translation && field.translation[field.key]
                ? field.translation[field.key]
                : field.label;
            let translatedValue;

            if (field.translation && field.translation[value]) {
              translatedValue = field.translation[value];
            } else if (field.formatter) {
              translatedValue = field.formatter(value);
            } else {
              translatedValue = value;
            }

            return (
              <div key={field.key} className={field.className || "w-fit"}>
                {label && <span className="font-medium">{label}: </span>}
                {translatedValue}
              </div>
            );
          })}
        </div>

        {/* body */}
        <div className="flex flex-col px-4 pb-4">
          {bodyFields.map((field) => {
            const value = (item as any)[field.key];

            if (value === undefined || value === null) return null;

            // Use translation map for label and value if available
            const label =
              field.translation && field.translation[field.key]
                ? field.translation[field.key]
                : field.label;
            let translatedValue;

            if (field.translation && field.translation[value]) {
              translatedValue = field.translation[value];
            } else if (field.formatter) {
              translatedValue = field.formatter(value);
            } else {
              translatedValue = value;
            }

            return (
              <div
                key={field.key}
                className={field.className || "text-gray-600"}
              >
                {label && <span className="font-medium">{label}: </span>}
                {translatedValue}
              </div>
            );
          })}
        </div>

        {/* footer */}
        {actions && actions.length > 0 && (
          <div>
            <Divider />
            <div className="flex justify-end gap-2 py-2 px-3">
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
    [statusConfig, headerFields, bodyFields, actions, cardClassName],
  );

  return (
    // <div className="flex flex-wrap justify-between items-center gap-8 w-full h-full">
    <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full h-full">
      {items && items.length > 0 ? (
        items.map((item) => renderCell(item))
      ) : (
        <></>
      )}
    </div>
  );
};
