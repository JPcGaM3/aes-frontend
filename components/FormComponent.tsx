import React, { useState, useEffect } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFields";
import FormButtons from "./FormButtons";

import { FormField } from "@/interfaces/interfaces";

interface FormComponentProps {
  hasHeader?: boolean;
  hasButtons?: boolean;
  title?: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  initialValues?: Record<string, any>;
  children?: React.ReactNode;
  onCancel?: () => void;
  onSubmit?: (values: any) => void;
  onChange?: (values: any) => void;
}

export default function FormComponent({
  hasHeader = true,
  hasButtons = true,
  title,
  subtitle,
  fields,
  submitLabel,
  cancelLabel,
  initialValues = {},
  children = null,
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
    <>
      {onSubmit ? (
        <Form
          className="flex flex-col gap-8 w-full max-w-xl"
          validationBehavior="aria"
          onSubmit={handleSubmit}
        >
          {hasHeader && <Header subtitle={subtitle} title={title as string} />}

          <FormFields
            fields={fields}
            onValueChange={handleValueChange}
            values={values}
          />

          {children}

          <FormButtons
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            onCancel={onCancel}
          />
        </Form>
      ) : (
        <div className="flex flex-col gap-8 w-full max-w-xl">
          {hasHeader && <Header subtitle={subtitle} title={title as string} />}

          <FormFields
            fields={fields}
            onValueChange={handleValueChange}
            values={values}
          />

          {children}
        </div>
      )}
    </>
  );
}
