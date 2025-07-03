import { InputConfig } from "@/interfaces/interfaces";
import { FormFieldsProps } from "@/interfaces/props";

import { getNestedValue, translateEnumValue } from "@/utils/functions";

import { Divider } from "@heroui/react";
import InputRenderer from "./InputRenderer";

export default function FormFields({
  sections,
  onValueChange,
  values = {},
}: FormFieldsProps) {
  const getValue = (config: InputConfig) => {
    // if (!config) return "";

    // if (config.path) {
    //   return getNestedValue(values, config.path) ?? "";
    // }

    // if (config.name && typeof values === "object" && values !== null) {
    //   return values[config.name] ?? config.defaultValue ?? "";
    // }

    // return config.defaultValue ?? "";
    console.log("values", values);
    return values[config.name] ?? "";
  };

  const commonProp: any = (config: InputConfig) => {
    const {
      type,
      name,
      hasLabel = true,
      labelTranslator,
      hasPlaceholder = true,
      labelPlacement,
      isReadOnly,
      isRequired,
      size,
      ...restProps
    } = config;

    const label = hasLabel
      ? translateEnumValue(name, labelTranslator || {})
      : undefined;

    const placeholder = hasPlaceholder
      ? type === "dropdown"
        ? `โปรดเลือก ${label || name}`
        : `โปรดกรอก ${label || name}`
      : undefined;

    return {
      name: name,
      label: label,
      placeholder: placeholder,
      "aria-label": config.name,
      radius: "sm",
      size: config.size || "md",
      disabled: config.isReadOnly || false,
      isRequired: config.isRequired || false,
      labelPlacement: config.labelPlacement || "outside",
      ...restProps,
    };
  };

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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-1 gap-y-4">
            {(section.fields).map((field, i) =>
              Array.isArray(field) ? (
                <div key={i} className="flex flex-row w-full gap-1">
                  {field.map(
                    (subField, subIndex) =>
                      subField && (
                        <InputRenderer
                          key={subIndex}
                          type={subField.type}
                          value={getValue(subField)}
                          commonProps={commonProp(subField)}
                          onValueChange={onValueChange}
                        />
                      )
                  )}
                </div>
              ) : (
                field && (
                  <InputRenderer
                    key={i}
                    type={field.type}
                    value={getValue(field)}
                    commonProps={commonProp(field)}
                    onValueChange={onValueChange}
                  />
                )
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
