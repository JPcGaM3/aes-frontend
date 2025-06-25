import React, { useState, useEffect } from "react";
import { Form } from "@heroui/react";

import Header from "./Header";
import FormFields from "./FormFields";
import FormButtons from "./FormButtons";

import { FormField } from "@/interfaces/interfaces";

interface FormComponentProps {
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: any) => void;
  onChange?: (values: any) => void;
  initialValues?: Record<string, any>;
}

export default function FormComponent({
  title,
  subtitle,
  fields,
  submitLabel,
  cancelLabel,
  onCancel,
  onSubmit,
  onChange,
  initialValues = {},
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
      <Form
        className="flex flex-col gap-8 w-full max-w-2xl"
        validationBehavior="aria"
        onSubmit={handleSubmit}
      >
        <Header subtitle={subtitle} title={title} />

        <FormFields
          fields={fields}
          onValueChange={handleValueChange}
          values={values}
        />

        <FormButtons
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          onCancel={onCancel}
        />
      </Form>
  );
}
