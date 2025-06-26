"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  monthList,
  RequestOrderTranslation,
  yearList,
} from "@/utils/constants";
import { FormField, RequestOrder } from "@/interfaces/interfaces";

import { Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";

import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import FormComponent from "@/components/FormComponent";

export default function AddRequestPage() {
  // Fetch data --------------------------------------------------------------------------------------------------
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [operationAreaOptions, setOperationAreaOptions] = useState([]);
  const [formValue, setFormValues] = useState<RequestOrder>({} as RequestOrder);

  useEffect(() => {
    const fetchCustomerTypes = async () => {
      const customer_type = await getCustomerTypes();
      setCustomerTypeOptions(customer_type);
    };

    fetchCustomerTypes();
  }, []);

  useEffect(() => {
    const fetchOperationAreas = async (params: any) => {
      const operation_area = await getOperationAreas(params);
      setOperationAreaOptions(operation_area);
    };

    fetchOperationAreas({
      ae_id: userContext.ae_id,
    });
  }, []);

  useEffect(() => {
    if (userContext.ae_id !== null) {
      setFormValues({
        ae_id: userContext?.ae_id,
        ap_year: currentYear,
        ap_month: currentMonth,
        created_by: userContext?.id,
      } as RequestOrder);
    }
  }, [userContext]);

  // Field configurations ----------------------------------------------------------------------------------------
  const workOrderFields: FormField[] = [
    {
      type: "dropdown",
      isRequired: true,
      name: "customer_type_id",
      translator: RequestOrderTranslation,
      options: [
        ...customerTypeOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
      ],
    },
    {
      type: "text",
      name: "phone",
      translator: RequestOrderTranslation,
    },
    [
      {
        type: "dropdown",
        name: "operation_area_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: [
          ...operationAreaOptions.map((option: any) => ({
            label: option.operation_area,
            value: option.id,
          })),
        ],
      },
      {
        type: "number",
        name: "zone",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "number",
        name: "quota_number",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
      },
      {
        type: "text",
        name: "farmer_name",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "dropdown",
        name: "ap_year",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: yearList,
      },
      {
        type: "dropdown",
        name: "ap_month",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
        options: monthList,
      },
    ],
    {
      type: "text",
      name: "supervisor_name",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "target_area",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "land_number",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "textarea",
      name: "location_xy",
      isRequired: true,
      translator: RequestOrderTranslation,
    }
  ];

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        className="p-0 flex flex-col w-full justify-center items-center"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="key-in"
          title="Key-in"
          className="flex flex-col w-full justify-center items-center"
        >
          <div className="p-4 flex flex-col w-full justify-center items-center">
            <FormComponent
              title="Add your request order"
              subtitle="Input your order details in the form below"
              fields={workOrderFields}
              submitLabel="Submit"
              cancelLabel="Clear form"
              onSubmit={(data) => console.log(data)}
              onCancel={() => console.log("Form cleared")}
              initialValues={formValue}
            />
          </div>
        </Tab>

        {/* Upload tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="upload"
          title="Upload"
          className="flex flex-col w-full justify-center items-center"
        >
          <div className="p-4">
            <Header
              title="Add your request order"
              subtitle="Upload your order files in the field below"
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
