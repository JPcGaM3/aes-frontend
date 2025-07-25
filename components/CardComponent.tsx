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
import NextLink from "next/link";

import { translateEnumValue } from "@/utils/functions";
import { GoToPageIcon, VerticalDotsIcon } from "@/utils/icons";
import { CardComponentProps } from "@/interfaces/interfaces";

export const CardComponent = <T extends { id: number | string }>({
  items,
  statusConfig,
  headerFields,
  bodyFields,
  actions,
  isActionsPage = false,
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
                    statusConfig.translation
                  )
                : (item as any)[statusConfig.key] || statusConfig.defaultValue}
            </Chip>
          )}

          {headerFields?.map((field) => {
            const value = (item as any)[field.key];
            // Use translation
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

            // Use translation
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
            <div className="flex justify-between items-center gap-2 py-2 px-3">
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

        {/* footer */}
        {isActionsPage && (
          <div>
            <Divider />
            <NextLink
              href={{
                pathname: `/order/${item.id}`,
                query: { data: JSON.stringify(item) },
              }}
            >
              <div className="flex justify-between items-center gap-2 p-3 text-gray-500">
                <div className=" text-sm">Click here to view more.</div>
                <GoToPageIcon />
              </div>
            </NextLink>
          </div>
        )}
      </div>
    ),
    [
      statusConfig,
      headerFields,
      bodyFields,
      actions,
      isActionsPage,
      cardClassName,
    ]
  );

  return (
    <div className="items-center gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full h-full">
      {items && items.length > 0 ? (
        items.map((item) => renderCell(item))
      ) : (
        <></>
      )}
    </div>
  );
};
