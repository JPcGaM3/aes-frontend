"use client";

import React from "react";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs, user } from "@heroui/react";

import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";

import { useLoading } from "@/providers/LoadingContext";
import { useAuth } from "@/providers/AuthContext";

import { getRequestOrderWithTask } from "@/libs/requestOrderAPI";
import {
  FieldSection,
  FormField,
  OperationAreaResponse,
} from "@/interfaces/interfaces";
import { AeArea, CustomerType, RequestOrder, User } from "@/interfaces/schema";
import {
  month,
  monthList,
  yearMap,
  yearList,
  RequestOrderTranslation,
} from "@/utils/constants";
import FormComponent from "@/components/FormComponent";
import { getOperationAreasUser } from "@/libs/operationAreaAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getAeAreas } from "@/libs/aeAreaAPI";
import { USERROLE } from "@/utils/enum";
import { getUsers } from "@/libs/userAPI";

export default function RequestManagementPage({
  params,
}: {
  params: Promise<{ rid: number }>;
}) {
  // const and hooks -------------------------------------------------------------------------------------------
  const { rid } = use(params);
  const { userContext } = useAuth();
  const { setIsLoading } = useLoading();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const action = searchParams.get("action") || "view";

  const [selectedTab, setSelectedTab] = useState(action);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [aeAreasData, setAeAreasData] = useState<AeArea[]>([]);
  const [customerTypesData, setCustomerTypesData] = useState<CustomerType[]>(
    []
  );
  const [operationAreasData, setOperationAreasData] = useState<
    OperationAreaResponse[]
  >([]);
  const [requestData, setRequestData] = useState<RequestOrder>(
    {} as RequestOrder
  );

  // Fetch data ------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (rid && userContext.token) {
      const fetchData = async ({
        token,
        requestId,
      }: {
        token: string;
        requestId: number;
      }) => {
        setIsLoading(true);

        try {
          const user = await getUsers({
            token: token,
            params: { role: USERROLE.UnitHead },
          });
          const ae_area = await getAeAreas({ token: token });
          const customer_type = await getCustomerTypes({ token: token });
          const operation_area = await getOperationAreasUser({ token: token });
          const request: RequestOrder = await getRequestOrderWithTask({
            token: token,
            requestId: requestId,
          });

          console.log("User Data:", user);
          console.log("AE Area Data:", ae_area);
          console.log("Customer Type Data:", customer_type);
          console.log("Operation Area Data:", operation_area);
          console.log("Request Data:", request);

          setUsersData(user);
          setAeAreasData(ae_area);
          setCustomerTypesData(customer_type);
          setOperationAreasData(operation_area);
          setRequestData({
            ...request,
            work_order_number: `${request.ae_area?.name}${request.operation_area?.operation_area}${request.ap_year ? Number(request.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${request.run_number || ""}`,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData({
        token: userContext.token,
        requestId: rid,
      });
    }
  }, [rid, userContext.token]);

  // Handler ---------------------------------------------------------------------------------------------------
  const handleTabChange = (key: React.Key) => {
    if (typeof key === "string") {
      setSelectedTab(key);

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("action");

      const newQuery = newSearchParams.toString();
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
  };

  // Field config ----------------------------------------------------------------------------------------------
  const dataSection: FieldSection[] = [
    {
      fields: [
        { label: "แหล่งที่มา", value: requestData?.customer_type?.name || "-" },
        {
          label: "วันที่สร้าง",
          value: requestData?.created_at?.toLocaleString() || "-",
        },
        { label: "สังกัด", value: requestData?.ae_area?.name || "-" },
        { label: "หัวหน้าหน่วย", value: requestData?.users?.fullname || "-" },
        { label: "ผู้ประสานงาน", value: requestData?.supervisor_name || "-" },
        { label: "เบอร์โทรศัพท์", value: requestData?.phone || "-" },
        {
          label: "เดือนที่จะเริ่ม",
          value: requestData?.ap_month || "-",
          translator: month,
        },
        {
          label: "ปีที่จะเริ่ม",
          value: String(requestData?.ap_year) || "-",
          translator: yearMap,
        },
      ],
    },
    {
      title: "สถานที่ปฏิบัติงาน",
      fields: [
        { label: "โควต้า", value: requestData?.quota_number || "-" },
        {
          label: "ชาวไร่",
          value: requestData?.farmer_name || "-",
        },
        { label: "เลขที่แปลง", value: requestData?.land_number || "-" },
        {
          label: "สถานที่",
          value: requestData?.operation_area?.operation_area || "-",
        },
        { label: "พิกัด", value: requestData?.location_xy || "-" },
        { label: "พื้นที่", value: requestData?.target_area || "-" },
      ],
    },
    {
      title: "กิจกรรมและเครื่องมือ",
      fields: [
        {
          label: "จำนวน",
          value: `${requestData?.taskorders?.length || 0} กิจกรรม`,
        },
      ],
    },
  ];

  const formFields: FormField[] = [
    [
      {
        type: "dropdown",
        name: "customer_type_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        isReadOnly: true,
        className: "w-1/2",
        options: [
          ...customerTypesData.map((item) => ({
            label: item.name || "-",
            value: item.id,
          })),
        ],
      },
      {
        type: "text",
        name: "created_at",
        isRequired: false,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        isReadOnly: true,
      },
    ],
    [
      {
        type: "dropdown",
        name: "ae_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        options: [
          ...aeAreasData.map((item) => ({
            label: item.name || "-",
            value: item.id,
          })),
        ],
      },
      {
        type: "dropdown",
        name: "unit_head_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        options: [
          ...usersData.map((item) => ({
            label: item.fullname || item.username || "-",
            value: item.id,
          })),
        ],
      },
    ],
    {
      type: "text",
      name: "supervisor_name",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "text",
      name: "phone",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    [
      {
        type: "dropdown",
        name: "ap_month",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        options: monthList,
      },
      {
        type: "dropdown",
        name: "ap_year",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        options: yearList,
      },
    ],
    [
      {
        type: "text",
        name: "quota_number",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
      },
      {
        type: "text",
        name: "farmer_name",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
      },
    ],
    [
      {
        type: "text",
        name: "land_number",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
      },
      {
        type: "dropdown",
        name: "operation_area_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/2",
        options: [
          ...operationAreasData.map((item) => ({
            label: item.operation_area.operation_area || "-",
            value: item.operation_area.id,
          })),
        ],
      },
    ],
    {
      type: "textarea",
      name: "location_xy",
      isRequired: false,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "target_area",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className="flex flex-col items-center justify-center w-full pt-3 font-semibold"
      >
        {/* View tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="view"
          title="รายละเอียด"
          className="flex flex-col items-center justify-center w-full gap-8"
        >
          <Header
            title="ดูรายละเอียดใบสั่งงาน"
            subtitle={`@${requestData.work_order_number}`}
            subtitleClassName={clsx(
              "mt-1 text-sm text-gray-600 font-mono",
              fontMono.variable
            )}
            hasBorder={false}
          />

          <FieldValueDisplayer sections={dataSection} />

          <Button
            size="lg"
            radius="sm"
            color="danger"
            variant="flat"
            className="w-full max-w-sm font-semibold sm:max-w-md md:max-w-lg lg:max-w-xl"
            onPress={() => {
              setIsLoading(true);
              router.push(`/request`);
            }}
          >
            ย้อนกลับ
          </Button>
        </Tab>

        {/* Edit tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="edit"
          title="แก้ไข"
          className="flex flex-col items-center justify-center w-full"
        >
          <FormComponent
            title="แก้ไขใบสั่งงาน"
            subtitle={`@${requestData.work_order_number}`}
            subtitleClassName={clsx(
              "mt-1 text-sm text-gray-600 font-mono",
              fontMono.variable
            )}
            values={requestData}
            sections={formFields}
            onSubmit={() => {}}
          />
        </Tab>

        {/* Reject tab ----------------------------------------------------------------------------------------- */}
        <Tab
          key="reject"
          title="ยกเลิก"
          className="flex flex-col items-center justify-center w-full"
        ></Tab>
      </Tabs>
    </div>
  );
}
