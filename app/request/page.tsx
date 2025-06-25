"use client";

import React from "react";
import { useEffect, useState } from "react";

import { useAuth } from "@/providers/AuthContext";
import { EditIcon, FilterIcon, InfoIcon, RejectIcon } from "@/utils/icons";
import { FieldConfig, FormField, RequestOrder } from "@/interfaces/interfaces";
import {
  RequestOrderStatusColorMap,
  RequestOrderStatusTranslation,
  RequestOrderTranslation,
  month,
  year,
} from "@/utils/constants";

import { Button, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";

import getCustomerTypes from "@/libs/customerTypeAPI";
import getAeAreas from "@/libs/aeAreaAPI";
import getRequestOrders from "@/libs/requestOrderAPI";

export default function RequestPage() {
  // Fetch data ------------------------------------------------------------------
  const { userContext } = useAuth();
  const [aeAreaOptions, setAeAreaOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [filterValues, setFilterValues] = useState<any>({});
  const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const ae_areas = await getAeAreas();
      const customer_type = await getCustomerTypes();

      setAeAreaOptions(ae_areas);
      setCustomerTypeOptions(customer_type);
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const fetchReqOrderData = async (params: any) => {
      const data = await getRequestOrders(params);
      setReqOrders(data);
    };

    fetchReqOrderData(filterValues);
  }, [filterValues]);

  // useState for modal and drawer visibility ------------------------------
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  // Handlers for modal and drawer actions ---------------------------------
  const handleApplyFilters = (values: any) => {
    setFilterValues(values);
    onCloseFilter();
  };

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
  };

  // Field configurations --------------------------------------------------
  const monthList = [
    ...Object.entries(month).map(([value, label]) => ({
      label: label as string,
      value: value as string,
    })),
  ];

  const yearList = [
    ...Object.entries(year).map(([value, label]) => ({
      label: label as string,
      value: value as string,
    })),
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
        { label: "ทั้งหมด", value: "all" },
        ...customerTypeOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
      ],
    },
    {
      type: "dropdown",
      name: "status",
      label: "สถานะ",
      placeholder: "โปรดเลือกสถานะ",
      options: [
        { label: "ทั้งหมด", value: "all" },
        ...Object.entries(RequestOrderStatusTranslation).map(
          ([value, label]) => ({
            label: label as string,
            value: value as string,
          })
        ),
      ],
    },
    [
      {
        type: "dropdown",
        name: "start_month",
        label: "เดือนเริ่มต้น",
        placeholder: "โปรดเลือกเดือนเริ่มต้น",
        options: monthList,
        className: "w-2/3",
      },
      {
        type: "dropdown",
        name: "start_year",
        label: "ปีเริ่มต้น",
        placeholder: "โปรดเลือกปีเริ่มต้น",
        options: yearList,
        className: "w-1/3",
      },
    ],
    [
      {
        type: "dropdown",
        name: "end_month",
        label: "เดือนสิ้นสุด",
        placeholder: "โปรดเลือกเดือนสิ้นสุด",
        options: monthList,
        className: "w-2/3",
      },
      {
        type: "dropdown",
        name: "end_year",
        label: "ปีสิ้นสุด",
        placeholder: "โปรดเลือกปีสิ้นสุด",
        options: yearList,
        className: "w-1/3",
      },
    ],
  ];

  const actions = [
    {
      key: "view",
      label: "ดูรายละเอียด",
      icon: <InfoIcon />,
      onClick: () => handleAction("view"),
    },
    {
      key: "edit",
      label: "แก้ไข",
      icon: <EditIcon />,
      onClick: () => handleAction("edit"),
    },
    {
      key: "reject",
      label: "ปฏิเสธ",
      icon: <RejectIcon />,
      className: "text-danger-500",
      onClick: () => handleAction("reject"),
    },
  ];

  const headerFields: FieldConfig[] = [
    {
      key: "quota_number",
      className: "text-black text-lg font-bold",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "farmer_name",
      className: "text-black text-lg font-bold",
      labelTranslator: RequestOrderTranslation,
    },
  ];

  const bodyFields: FieldConfig[] = [
    {
      key: "customer_type.name",
      className: "text-gray-600 text-md font-semibold",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "work_order_number",
      className: "text-gray-600 text-md font-semibold pb-4",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "land_number",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "_count.taskorders",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "ap_month",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
      valueTranslator: RequestOrderTranslation,
    },
    {
      key: "ap_year",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
    },
  ];

  const statusConfig = {
    colorMap: RequestOrderStatusColorMap,
    translation: RequestOrderStatusTranslation,
  };

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

      {/* Body ------------------------------------------------------------- */}
      <CardComponent
        actions={actions}
        bodyFields={bodyFields}
        headerFields={headerFields}
        items={reqOrders}
        statusConfig={statusConfig}
      />
    </div>
  );
}
