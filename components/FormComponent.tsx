import React from "react";
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
  onSubmit: (e: React.FormEvent) => void;
  onValueChange?: (name: string, value: string) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  title,
  subtitle,
  fields,
  submitLabel,
  cancelLabel,
  onCancel,
  onSubmit,
  onValueChange,
}) => (
  <Form
    className="flex flex-col gap-4 w-full"
    validationBehavior="aria"
    onSubmit={onSubmit}
  >
    <Header subtitle={subtitle} title={title} />
    <FormFields fields={fields} onValueChange={onValueChange} />
    <FormButtons
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      onCancel={onCancel}
    />
  </Form>
);

export default FormComponent;
