"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  RequestOrderStatusColorMap,
  RequestOrderStatusTranslation,
  RequestOrderTranslation,
  month,
} from "@/utils/constants";
import { FormField, RequestOrder } from "@/interfaces/interfaces";

import { Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";

import getCustomerTypes from "@/libs/customerTypeAPI";
import getAeAreas from "@/libs/aeAreaAPI";
import FormComponent from "@/components/FormComponent";

export default function AddRequestPage() {
  // Fetch data ------------------------------------------------------------------
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = Object.keys(month)[now.getMonth()];

  const [aeAreaOptions, setAeAreaOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [formValue, setFormValues] = useState<RequestOrder>({
    ap_year: currentYear,
    ap_month: currentMonth,
    created_by: userContext?.id,
  } as RequestOrder);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const ae_areas = await getAeAreas();
      const customer_type = await getCustomerTypes();

      setAeAreaOptions(ae_areas);
      setCustomerTypeOptions(customer_type);
    };

    fetchDropdownData();
  }, []);

  const inputFields: FormField[] = [
    // {
    //     "customer_type": "ไร่บริษัท",
    //     "phone": "099-999-9999",
    //     "operation_area": "RDC0",
    //     "zone": "110302",
    //     "quota_number": "110302",
    //     "farmer_name": "น้ำปลีก",
    //     "target_area": 25,
    //     "land_number": 110302106,
    //     "location_xy": "POLYGON((102.25297562 16.22933296,102.24774915 16.23109708,102.24829965 16.23239083,102.24840038 16.23253653,102.24845718 16.23267447,102.2486908 16.23316208,102.24878102 16.23347415,102.24982015 16.23314193,102.25049242 16.23280154,102.25098552 16.2325321,102.25149342 16.23227249,102.25183211 16.23207591,102.25176576 16.23188483,102.25205707 16.23173843,102.2531239 16.23123115,102.2536032 16.23100074,102.25337511 16.23042657,102.25297562 16.22933296))",
    //     "activities": "ปรับพื้นที่ / ดันกอง+ไถกลบเศษซาก+ไถพรวน 1",
    //     "tool_types": "Land Plan+ผานกลบเศษซาก 4,6 จาน ครั้งที่ 1+พรวน 24 จาน ออสเตรเลีย (HODGE)",
    //     "ap_month": "มิถุนายน",
    //     "ap_year": 2568,
    //     "supervisor_name": "นายสิริ วิโรธ",
    //     "user_id": 1
    // },
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
              fields={inputFields}
              submitLabel="Submit"
              cancelLabel="Clear form"
              onSubmit={(data) => console.log(data)}
              onCancel={() => console.log("Form cleared")}
            />
          </div>
        </Tab>

        {/* Upload tab ------------------------------------------------------------------------------------------- */}
        <Tab key="upload" title="Upload">
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
