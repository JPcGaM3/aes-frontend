"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  monthList,
  RequestOrderTranslation,
  yearList,
} from "@/utils/constants";
import { FormField, RequestOrder, UploadedFile } from "@/interfaces/interfaces";

import { Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";

import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import FormComponent from "@/components/FormComponent";
import { uploadRequestOrder } from "@/libs/requestOrderAPI";
import UploadComponent from "@/components/UploadComponent";
import FormButtons from "@/components/FormButtons";

export default function AddRequestPage() {
  // const value & react hook -------------------------------------------------------------------------------------
  // * For key-in form
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [operationAreaOptions, setOperationAreaOptions] = useState([]);
  const [formValue, setFormValues] = useState<RequestOrder>({} as RequestOrder);

  // * For file upload
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Fetch data ---------------------------------------------------------------------------------------------------
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

  // Handler ------------------------------------------------------------------------------------------------------
  // TODO: Change button to "Downloaded!" and disable it for a sec.
  const handleDownloadTemplate = (): void => {
    const link = document.createElement("a");

    link.href = "/excel/request_orders_template.xlsx";
    link.download = "request_orders_template.xlsx";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  // TODO: Handle Alerts: use Alert component instead of window.alert
  const handleConfirm = async (_e?: any): Promise<void> => {
    if (uploadedFiles.length === 0) {
      alert("Please upload files before confirming.");
      return;
    }

    setIsUploading(true);
    console.log(
      "Attempting to upload files with Axios:",
      uploadedFiles.map((f) => f.name)
    );

    // TODO: Handle success
    // * After successful upload, reset the uploadedFiles state
    // * Change the button to "Uploaded!" and disable it for a sec.
    try {
      const response = await uploadRequestOrder(
        uploadedFiles,
        userContext.ae_id!,
        userContext.id!
      );

      console.log("Upload successful:", response);
    } catch (error) {
      // TODO: Handle error
      // * Show an error message to the user
      // * Use Alert component instead of console.error

      console.error("Upload failed:", error);
    } finally {
      // TODO: Remove timeout
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFiles([]);
      }, 500);
    }
  };

  const handleCancel = (_e?: any): void => {
    console.log("Cancelling upload");
    setUploadedFiles([]);
  };

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
    },
  ];

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        className="p-0 flex flex-col w-full justify-center items-center font-semibold"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="key-in"
          title="Key-in"
          className="flex flex-col w-full justify-center items-center"
        >
          <div className="p-4 flex flex-col w-full justify-center items-center">
            <FormComponent
              title="สร้างใบสั่งงาน"
              subtitle="กรุณากรอกข้อมูลใบสั่งงานลงในฟอร์มด้านล่าง"
              fields={workOrderFields}
              submitLabel="ยืนยัน"
              cancelLabel="ยกเลิก"
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
          <UploadComponent
            isUploading={isUploading}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onSubmit={handleConfirm}
            onCancel={handleCancel}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
