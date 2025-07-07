import React, { useState, useEffect } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFieldsComponent";
import FormButtons from "./FormButtons";

import type { FormComponentProps } from "@/interfaces/props";

export default function FormComponent({
  hasHeader = true,
  title,
  subtitle,
  sections,
  submitLabel,
  cancelLabel,
  isSubmitting,
  isCanceling,
  values = {},
  children = null,
  className,
  subtitleClassName,
  onCancel,
  onSubmit,
  onChange,
  isCompact = false,
}: FormComponentProps & { isCompact?: boolean }) {
  const [formValues, setFormValues] = useState<any>(values);

  useEffect(() => {
    setFormValues(values);
  }, [JSON.stringify(values)]);

  const handleValueChange = (name: string, value: any) => {
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    if (onChange) {
      onChange(newValues);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      (onSubmit as any)(formValues);
    }
  };

  const computedClassName =
    className ||
    (isCompact
      ? "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
      : "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl");

  return (
    <div className={computedClassName}>
      {onSubmit ? (
        <Form
          className={"flex flex-col w-full gap-8"}
          validationBehavior="aria"
          onSubmit={handleSubmit}
        >
          {hasHeader && (
            <Header
              subtitle={subtitle}
              title={title}
              subtitleClassName={subtitleClassName}
            />
          )}

          <FormFields
            sections={sections}
            onValueChange={handleValueChange}
            values={formValues}
            isCompact={isCompact}
          />

          {children}

          <FormButtons
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            isSubmitting={isSubmitting}
            isCanceling={isCanceling}
            onCancel={onCancel}
          />
        </Form>
      ) : (
        <div className="flex flex-col w-full gap-8">
          {hasHeader && (
            <Header
              subtitle={subtitle}
              title={title as string}
              subtitleClassName={subtitleClassName}
            />
          )}

          <FormFields
            sections={sections}
            onValueChange={handleValueChange}
            values={formValues}
            isCompact={isCompact}
          />

          {children}
        </div>
      )}
    </div>
  );
}
