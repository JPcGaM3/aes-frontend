"use client";

import React, { useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthContext";
import { FilterIcon } from "@/utils/icons";
import { DropdownOption, FormField } from "@/interfaces/interfaces";

import { Button, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import getCustomerTypes from "@/libs/customerTypeAPI";
import getAeAreas from "@/libs/aeAreaAPI";

export default function RequestPage() {
  const { userContext } = useAuth();

  // useState for modal and drawer visibility ------------------------------
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  // Handlers for modal and drawer actions ---------------------------------
  const handleApplyFilters = (values: any) => {
    onCloseFilter();
  };

  // Field configurations --------------------------------------------------
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [aeAreaOptions, setAeAreaOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const ae_areas = await getAeAreas();
      const customer_type = await getCustomerTypes();

      console.log("AE Area options: ", ae_areas);
      console.log("Customer type options: ", customer_type);

      setAeAreaOptions(ae_areas);
      setCustomerTypeOptions(customer_type);
    };

    fetchData();
  }, []);

  const month = [
    { label: "มกราคม", value: "january" },
    { label: "กุมภาพันธ์", value: "february" },
    { label: "มีนาคม", value: "march" },
    { label: "เมษายน", value: "april" },
    { label: "พฤษภาคม", value: "may" },
    { label: "มิถุนายน", value: "june" },
    { label: "กรกฎาคม", value: "july" },
    { label: "สิงหาคม", value: "august" },
    { label: "กันยายน", value: "september" },
    { label: "ตุลาคม", value: "october" },
    { label: "พฤศจิกายน", value: "november" },
    { label: "ธันวาคม", value: "december" },
  ];

  const year = [
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
  ];

  const filterFields: FormField[] = [
    {
      type: "dropdown",
      name: "ae",
      label: "สังกัด",
      placeholder: "โปรดเลือกสังกัด",
      options: aeAreaOptions.map((option: any) => ({
        label: option.name,
        value: String(option.id),
      })),
    },
    {
      type: "dropdown",
      name: "customer_type",
      label: "หัวตารางแจ้งงาน",
      placeholder: "โปรดเลือกหัวตารางแจ้งงาน",
      options: [
        ...customerTypeOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
        { label: "ทั้งหมด", value: "all" },
      ],
    },
    {
      type: "dropdown",
      name: "status",
      label: "สถานะ",
      placeholder: "โปรดเลือกสถานะ",
      options: [
        { label: "ทั้งหมด", value: "all" },
        { label: "รอดำเนินการ", value: "pending" },
        { label: "เสร็จสิ้น", value: "completed" },
      ],
    },
    [
      {
        type: "dropdown",
        name: "start_month",
        label: "เดือนเริ่มต้น",
        placeholder: "โปรดเลือกเดือนเริ่มต้น",
        options: month,
      },
      {
        type: "dropdown",
        name: "start_year",
        label: "ปีเริ่มต้น",
        placeholder: "โปรดเลือกปีเริ่มต้น",
        options: year,
      },
    ],
    [
      {
        type: "dropdown",
        name: "end_month",
        label: "เดือนสิ้นสุด",
        placeholder: "โปรดเลือกเดือนสิ้นสุด",
        options: month,
      },
      {
        type: "dropdown",
        name: "end_year",
        label: "ปีสิ้นสุด",
        placeholder: "โปรดเลือกปีสิ้นสุด",
        options: year,
      },
    ],
  ];

  return (
    <div>
      {/* Modal ------------------------------------------------------------- */}
      <FilterModal
        isOpen={isOpenFilter}
        title="ฟิลเตอร์รายการใบสั่งงาน"
        fields={filterFields}
        submitLabel="Apply Filters"
        cancelLabel="Cancel"
        onSubmit={handleApplyFilters}
        onClose={() => onCloseFilter()}
        initialValues={{
          ae: String(userContext.ae_id),
          customer_type: "all",
          status: "all",
          start_month: "june",
          start_year: "2025",
        }}
      />

      {/* Header ----------------------------------------------------------- */}
      <Header title="รายการใบสั่งงาน" className="mb-6 w-full text-left">
        <Button
          radius="sm"
          variant="flat"
          color="primary"
          endContent={<FilterIcon />}
          onPress={onOpenFilter}
          className="font-semibold"
        >
          Filter
        </Button>
      </Header>
    </div>
  );
}
