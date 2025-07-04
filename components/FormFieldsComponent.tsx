import { InputConfig } from "@/interfaces/interfaces";
import { FormFieldsProps } from "@/interfaces/props";

import { getNestedValue, translateEnumValue } from "@/utils/functions";

import { Divider } from "@heroui/react";
import InputRenderer from "./InputRenderer";
import { useCallback } from "react";

export default function FormFields({
  sections,
  onValueChange,
  values = {},
  isCompact = false,
}: FormFieldsProps & { isCompact?: boolean }) {
  const getValue = useCallback(
    (config: InputConfig) => {
      if (!config) {
        return "";
      }

      if (config.type === "date" || config.type === "date-range") {
        if (config.path) {
          return getNestedValue(values, config.path) ?? null;
        }
        if (config.name && typeof values === "object" && values !== null) {
          return values[config.name] ?? config.defaultValue ?? null;
        }
        return config.defaultValue ?? null;
      } else {
        if (config.path) {
          return getNestedValue(values, config.path) ?? "";
        }
        if (config.name && typeof values === "object" && values !== null) {
          return values[config.name] ?? config.defaultValue ?? "";
        }
      }

      return config.defaultValue ?? "";
    },
    [values]
  );

  const commonProp: any = useCallback((config: InputConfig) => {
    const {
      type,
      name,
      hasLabel = true,
      label,
      labelTranslator,
      hasPlaceholder = true,
      labelPlacement,
      isReadOnly,
      isRequired,
      size,
      className,
      ...restProps
    } = config;

    const labelValue =
      hasLabel === false
        ? undefined
        : label
          ? translateEnumValue(label, labelTranslator || {})
          : translateEnumValue(name, labelTranslator || {});

    const placeholder = hasPlaceholder
      ? type === "dropdown"
        ? `โปรดเลือก ${labelValue || name}`
        : `โปรดกรอก ${labelValue || name}`
      : undefined;

    return {
      name: name,
      label: labelValue,
      placeholder: placeholder,
      "aria-label": config.name,
      radius: "sm",
      size: config.size || "md",
      isDisabled: config.isReadOnly || false,
      isRequired: config.isRequired || false,
      labelPlacement: config.labelPlacement || "outside",
      className: `w-full ${className || ""}`,
      classNames: {
        label: "min-w-[100px] text-start",
        wrapper: "w-full",
      },
      ...restProps,
    };
  }, []);

  return (
    <div className="flex flex-col w-full gap-2">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col w-full gap-2">
          {/* Title ----------------------------------------------------------------------------------------------------------------------- */}
          {section.title && (
            <div className="flex items-center w-full gap-5">
              <span className="text-lg font-semibold text-primary">
                {section.title}
              </span>

              <Divider className="flex-1 w-full bg-primary" />
            </div>
          )}

          {/* Fields ---------------------------------------------------------------------------------------------------------------------- */}
          <div
            className={`grid w-full ${isCompact ? "gap-2 grid-cols-1" : "gap-4 grid-cols-[repeat(auto-fit,minmax(400px,1fr))]"}`}
          >
            {section.fields.map((field, i) =>
              Array.isArray(field) ? (
                <div key={i} className="flex flex-row w-full gap-1">
                  {field.map(
                    (subField, subIndex) =>
                      subField && (
                        <InputRenderer
                          key={subIndex}
                          type={subField.type}
                          value={getValue(subField)}
                          commonProps={commonProp({
                            ...subField,
                            labelPlacement: subField.labelPlacement || "outside",
                          })}
                          onValueChange={onValueChange}
                        />
                      )
                  )}
                </div>
              ) : (
                field && (
                  <div key={i} className="w-full col-span-1">
                    <InputRenderer
                      type={field.type}
                      value={getValue(field)}
                      commonProps={commonProp({
                        ...field,
                        labelPlacement: field.labelPlacement || "outside",
                      })}
                      onValueChange={onValueChange}
                    />
                  </div>
                )
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
