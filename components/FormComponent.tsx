import React, { useState, useEffect } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFields";
import FormButtons from "./FormButtons";

import type { FormComponentProps } from "@/interfaces/props";

export default function FormComponent({
  hasHeader = true,
  title,
  subtitle,
  fields,
  submitLabel,
  cancelLabel,
  isSubmitting,
  isCanceling,
  initialValues = {},
  children = null,
  className = "w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl",
  subtitleClassName,
  onCancel,
  onSubmit,
  onChange,
}: FormComponentProps) {
  const [values, setValues] = useState<any>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [JSON.stringify(initialValues)]);

  const handleValueChange = (name: string, value: any) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    if (onChange) {
      onChange(newValues);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      (onSubmit as any)(values);
    }
  };

  return (
    <div className={className}>
      {onSubmit ? (
        <Form
          className="flex flex-col w-full max-w-xl gap-8"
          validationBehavior="aria"
          onSubmit={handleSubmit}
        >
          {hasHeader && (
            <Header
              subtitle={subtitle}
              title={title as string}
              subtitleClassName={subtitleClassName}
            />
          )}

          <FormFields
            fields={fields}
            onValueChange={handleValueChange}
            values={values}
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
        <div className="flex flex-col w-full max-w-xl gap-8">
          {hasHeader && (
            <Header
              subtitle={subtitle}
              title={title as string}
              subtitleClassName={subtitleClassName}
            />
          )}

          <FormFields
            fields={fields}
            onValueChange={handleValueChange}
            values={values}
          />

          {children}
        </div>
      )}
    </div>
  );
}
