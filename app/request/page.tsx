"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  EditIcon,
  FilterIcon,
  InfoIcon,
  PlusIcon,
  RejectIcon,
} from "@/utils/icons";
import {
  RequestOrderStatusColorMap,
  RequestOrderStatusTranslation,
  RequestOrderTranslation,
  monthList,
  yearList,
} from "@/utils/constants";
import { FieldConfig, FormField, RequestOrder } from "@/interfaces/interfaces";

import { Button, Divider, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";

import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeAreas } from "@/libs/aeAreaAPI";
import { getRequestOrders } from "@/libs/requestOrderAPI";
import { useLoading } from "@/providers/LoadingContext";

interface filterInterface {
  ae_id?: string;
  customer_type_id?: string;
  status?: string;
  start_month?: string;
  start_year?: string;
  end_month?: string;
  end_year?: string;
}

export default function RequestPage() {
  // Fetch data ------------------------------------------------------------------
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [aeAreaOptions, setAeAreaOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<filterInterface | null>(null);

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
    if (userContext.ae_id !== null) {
      setFilterValues({
        ae_id: String(userContext.ae_id),
        start_month: currentMonth,
        start_year: currentYear,
      });
    }
  }, [userContext]);

  useEffect(() => {
    const fetchReqOrderData = async (params: any) => {
      try {
        setError(null);
        const data = await getRequestOrders(params);
        setReqOrders(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setReqOrders([]);
      }
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

  const router = useRouter();
  const { setIsLoading } = useLoading();
  const handleNewPage = (action: string) => {
    setIsLoading(true);

    switch (action) {
      case "add":
        router.push("/request/add");
        break;

      default:
        console.log(`Action triggered: ${action}`);
        setIsLoading(false);
        break;
    }
  };

  // Field configurations --------------------------------------------------
  const filterFields: FormField[] = [
    {
      type: "dropdown",
      name: "ae_id",
      label: "สังกัด",
      options: [
        { label: "ทั้งหมด", value: "all" },
        ...aeAreaOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
      ],
    },
    {
      type: "dropdown",
      name: "customer_type_id",
      label: "หัวตารางแจ้งงาน",
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
        options: monthList,
        className: "w-2/3",
      },
      {
        type: "dropdown",
        name: "start_year",
        label: "ปีเริ่มต้น",
        options: yearList,
        className: "w-1/3",
      },
    ],
    [
      {
        type: "dropdown",
        name: "end_month",
        label: "เดือนสิ้นสุด",
        options: monthList,
        className: "w-2/3",
      },
      {
        type: "dropdown",
        name: "end_year",
        label: "ปีสิ้นสุด",
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
      onClick: () => handleNewPage("view"),
    },
    {
      key: "edit",
      label: "แก้ไข",
      icon: <EditIcon />,
      onClick: () => handleNewPage("edit"),
    },
    {
      key: "reject",
      label: "ปฏิเสธ",
      icon: <RejectIcon />,
      className: "text-danger-500",
      onClick: () => handleNewPage("reject"),
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
        initialValues={filterValues as any}
      />

      {/* Header ----------------------------------------------------------- */}
      <Header title="รายการใบสั่งงาน" className="mb-6 w-full text-left">
        <Button
          radius="sm"
          variant="flat"
          color="primary"
          endContent={<FilterIcon />}
          onPress={onOpenFilter}
          className="hidden sm:inline-flex font-semibold"
        >
          Filter
        </Button>

        <Button
          isIconOnly
          radius="sm"
          variant="flat"
          color="primary"
          endContent={<FilterIcon />}
          onPress={onOpenFilter}
          className="sm:hidden"
        />

        <Divider orientation="vertical" className="w-[1px]" />

        <Button
          radius="sm"
          variant="solid"
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => handleNewPage("add")}
          className="hidden sm:inline-flex font-semibold"
        >
          Add
        </Button>

        <Button
          isIconOnly
          radius="sm"
          variant="solid"
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => handleNewPage("add")}
          className="sm:hidden"
        />
      </Header>

      {/* Body ------------------------------------------------------------- */}
      {error ? (
        <div className="text-gray-500 font-medium text-center my-8">
          {error}
        </div>
      ) : (
        <div>
          <div className="mb-4 text-gray-700 font-medium text-right">
            {`จำนวนทั้งหมด: ${reqOrders.length ?? 0} รายการ`}
          </div>

          <CardComponent
            actions={actions}
            bodyFields={bodyFields}
            headerFields={headerFields}
            items={reqOrders}
            statusConfig={statusConfig}
          />
        </div>
      )}
    </div>
  );
}
