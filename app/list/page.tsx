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
import { FieldConfig, FormField, FormSection } from "@/interfaces/interfaces";

import { Button, Divider, useDisclosure } from "@heroui/react";

import Header from "@/components/Header";
import FilterModal from "@/components/FilterModal";
import CardComponent from "@/components/CardComponent";

import { getRequestOrders } from "@/libs/requestOrderAPI";
import { useLoading } from "@/providers/LoadingContext";
import clsx from "clsx";
import { fontMono } from "@/config/fonts";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { RequestOrder } from "@/interfaces/schema";

interface filterInterface {
  operation_area_id?: number;
  start_month?: string;
  start_year?: string;
  end_month?: string;
  end_year?: string;
}

export default function ListPage() {
  const router = useRouter();
  const { userContext, isReady } = useAuth();
  const { setIsLoading } = useLoading();
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onClose: onCloseFilter,
  } = useDisclosure();

  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [reqOrders, setReqOrders] = useState<RequestOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<filterInterface>({
    start_month: currentMonth,
    start_year: currentYear,
  });

  const fetchRequestOrderData = async ({ token }: { token: string }) => {
    try {
      const params = filterValues
        ? {
            start_month: filterValues.start_month
              ? filterValues.start_month.toString()
              : undefined,
            start_year: filterValues.start_year
              ? filterValues.start_year.toString()
              : undefined,
            end_month: filterValues.end_month
              ? filterValues.end_month.toString()
              : undefined,
            end_year: filterValues.end_year
              ? filterValues.end_year.toString()
              : undefined,
            status: REQUESTORDERSTATUS.PendingApproval.toUpperCase(),
            ae_id: userContext.aeAreaId,
          }
        : undefined;
      setError(null);
      const data = await getRequestOrders({ token: token, paramData: params });
      if (!data) {
        setReqOrders([]);
      }
      setReqOrders(data || []);
    } catch (error: any) {
      setError(error.message || "Unknown error");
      setReqOrders([]);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (
      isReady &&
      userContext.id &&
      userContext.token &&
      userContext.role &&
      userContext.operationAreaId
    ) {
      const fetchData = async (): Promise<any> => {
        try {
          setReqOrders([]);
          await fetchRequestOrderData({
            token: userContext.token,
          });
        } catch (error) {
          console.error("Failed to fetch:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [userContext, filterValues, isReady]);

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
        "mt-1 font-mono text-gray-600 text-sm",
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
      key: "customer_type.name",
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
        "mt-1 font-mono text-gray-600 text-sm",
        fontMono.variable
      ),
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
      valueTranslator: month,
    },
    {
      key: "ap_year",
      className: "text-gray-500 text-sm",
      labelTranslator: RequestOrderTranslation,
      valueTranslator: yearMap,
    },
  ];

  const filterFields: FormSection[] = [
    {
      fields: [
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
      ],
    },
    {
      fields: [
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

  const statusConfig = {
    colorMap: RequestOrderStatusColorMap,
    translation: RequestOrderStatusTranslation,
  };

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
        router.push(`/list/${params.id}?action=${params.action}`);
        break;

      case "add":
        router.push("/list/add");
        break;

      default:
        console.log(`Action triggered: ${params.action}`);
        setIsLoading(false);
        break;
    }
  };

  return (
    <div>
      {/* Modal ------------------------------------------------------------- */}
      <FilterModal
        isOpen={isOpenFilter}
        title="ฟิลเตอร์รายการใบสั่งงาน"
        sections={filterFields}
        submitLabel="Apply Filters"
        cancelLabel="Cancel"
        onSubmit={handleApplyFilters}
        onClose={() => onCloseFilter()}
        values={filterValues}
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
          onPress={() => handleNewPage({ params: { action: "add" } })}
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
          onPress={() => handleNewPage({ params: { action: "add" } })}
          className="sm:hidden"
        />
      </Header>

      {/* Body ------------------------------------------------------------- */}
      {error ? (
        <div className="my-8 font-medium text-gray-500 text-center">
          {error}
        </div>
      ) : (
        <div>
          <div className="mb-4 font-medium text-gray-700 text-right">
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
