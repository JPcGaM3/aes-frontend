"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  month,
  monthList,
  yearList,
  yearMap,
} from "@/utils/constants";
import { FieldConfig, FormSection } from "@/interfaces/interfaces";
import { RequestOrder } from "@/interfaces/schema";

import { Button, Divider, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";

import { getRequestOrders } from "@/libs/requestOrderAPI";
import { useLoading } from "@/providers/LoadingContext";
import clsx from "clsx";
import { fontMono } from "@/config/fonts";

interface filterInterface {
  status?: string;
  operation_area_id?: number;
  start_month?: string;
  start_year?: string;
  end_month?: string;
  end_year?: string;
}

export default function RequestPage() {
  // Fetch data ------------------------------------------------------------------
  const { userContext } = useAuth();
  const { setIsLoading } = useLoading();

  const router = useRouter();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<filterInterface | null>(
    null
  );

  // TODO: core fetch function
  useEffect(() => {
    const fetchDropdownData = async () => {
      setFilterValues({
        start_month: currentMonth,
        start_year: currentYear,
      });
    };

    fetchDropdownData();
  }, []);

  // TODO: core fetch function
  useEffect(() => {
    const fetchReqOrderData = async ({
      token,
      params,
    }: {
      token: string;
      params: any;
    }) => {
      if (token && params) {
        try {
          setError(null);
          const data = await getRequestOrders({ token, paramData: params });
          setReqOrders(data);
        } catch (err: any) {
          setError(err.message || "Unknown error");
          setReqOrders([]);
        }
      }
    };

    const params = {
      ...filterValues,
      operation_area_id: userContext.operationAreaId,
    };

    fetchReqOrderData({ token: userContext.token, params: params });
  }, [userContext, filterValues]);

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

  const handleNewPage = ({
    params,
  }: {
    params: {
      action: string;
      id?: number;
    };
  }) => {
    setIsLoading(true);

    switch (params.action) {
      case "view":
      case "edit":
      case "reject":
        router.push(`/request/${params.id}?action=${params.action}`);
        break;

      case "add":
        router.push("/request/add");
        break;

      default:
        console.log(`Action triggered: ${params.action}`);
        setIsLoading(false);
        break;
    }
  };

  // Field configurations --------------------------------------------------
  const filterSections: FormSection[] = [
    {
      fields: [
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
      ],
    },
  ];

  const actions = [
    {
      key: "view",
      label: "ดูรายละเอียด",
      icon: <InfoIcon />,
      onClick: ({ item }: { item: RequestOrder }) =>
        handleNewPage({ params: { id: item.id, action: "view" } }),
    },
    {
      key: "edit",
      label: "แก้ไข",
      icon: <EditIcon />,
      onClick: ({ item }: { item: RequestOrder }) =>
        handleNewPage({ params: { id: item.id, action: "edit" } }),
    },
    {
      key: "reject",
      label: "ปฏิเสธ",
      icon: <RejectIcon />,
      className: "text-danger-500",
      onClick: ({ item }: { item: RequestOrder }) =>
        handleNewPage({ params: { id: item.id, action: "reject" } }),
    },
  ];

  const headerFields: FieldConfig[] = [
    {
      key: "quota_number",
      className: "text-black text-lg font-bold",
      labelTranslator: RequestOrderTranslation,
      valueClassName: clsx(
        "mt-1 text-sm text-gray-600 font-mono",
        fontMono.variable
      ),
    },
    {
      key: "farmer_name",
      className: "text-black text-lg font-bold",
      labelTranslator: RequestOrderTranslation,
    },
  ];

  const bodyFields: FieldConfig[] = [
    {
      key: "customer_type",
      path: "customer_type.name",
      className: "text-gray-600 text-md font-semibold",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "work_order_number",
      className: "text-gray-600 text-md font-semibold pb-4",
      labelTranslator: RequestOrderTranslation,
      valueFunction: (item: any) => {
        const aeArea = item.ae_area?.name || "";
        const opArea = item.operation_area?.operation_area || "";
        const year = item.ap_year ? Number(item.ap_year) + 543 : "";
        const run = item.run_number || "";
        return `${aeArea}${opArea}${year + "/"}${run}`;
      },
      valueClassName: clsx(
        "mt-1 text-sm text-gray-600 font-mono",
        fontMono.variable
      ),
    },
    {
      key: "land_number",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "count",
      path: "_count.taskorders",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
    },
    {
      key: "ap_month",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
      valueTranslator: month,
    },
    {
      key: "ap_year",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
      valueTranslator: yearMap,
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
        sections={filterSections}
        submitLabel="Apply Filters"
        cancelLabel="Cancel"
        onSubmit={handleApplyFilters}
        onClose={() => onCloseFilter()}
        values={filterValues as any}
      />

      {/* Header ----------------------------------------------------------- */}
      <Header
        title="รายการใบสั่งงาน"
        subtitle="ใบสั่งงานทั้งหมด"
        orientation="horizontal"
        className="w-full mb-6 text-left"
      >
        <Button
          radius="sm"
          variant="flat"
          color="primary"
          endContent={<FilterIcon />}
          onPress={onOpenFilter}
          className="hidden font-semibold sm:inline-flex"
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

        <Divider orientation="vertical" className="w-[1px] h-10" />

        <Button
          radius="sm"
          variant="solid"
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => handleNewPage({ params: { action: "add" } })}
          className="hidden font-semibold sm:inline-flex"
        >
          Add
        </Button>

        <Button
          isIconOnly
          radius="sm"
          variant="solid"
          color="primary"
          endContent={<PlusIcon />}
          onPress={() => handleNewPage({ params: { action: "add" } })}
          className="sm:hidden"
        />
      </Header>

      {/* Body ------------------------------------------------------------- */}
      {error ? (
        <div className="my-8 font-medium text-center text-gray-500">
          {error}
        </div>
      ) : (
        <div>
          <div className="mb-4 font-medium text-right text-gray-700">
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
