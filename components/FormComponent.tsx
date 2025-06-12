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
  onCancel?: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({
  title,
  subtitle,
  fields,
  onCancel,
  onSubmit,
}) => (
  <Form
    className="flex flex-col gap-4 w-full max-w-md"
    validationBehavior="aria"
    onSubmit={onSubmit}
  >
    <Header subtitle={subtitle} title={title} />
    <FormFields fields={fields} />
    <FormButtons onCancel={onCancel} />
  </Form>
);

export default FormComponent;
