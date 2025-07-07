"use client";

import React, { useEffect } from "react";
import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import clsx from "clsx";
import { fontMono } from "@/config/fonts";

import { Button, Tab, Tabs } from "@heroui/react";

import Header from "@/components/Header";
import FieldValueDisplayer from "@/components/FieldValueDisplayer";
import { useLoading } from "@/providers/LoadingContext";
import { FormSection, OperationAreaResponse } from "@/interfaces/interfaces";
import { User, AeArea, CustomerType, RequestOrder } from "@/interfaces/schema";
import { useAuth } from "@/providers/AuthContext";
import {
  getRequestOrderWithTask,
  SetStatusRequestOrder,
} from "@/libs/requestOrderAPI";
import FormComponent from "@/components/FormComponent";
import { REQUESTORDERSTATUS } from "@/utils/enum";
import { AlertComponentProps } from "@/interfaces/props";
import AlertComponent from "@/components/AlertComponent";

export default function RequestManagementPage({
  params,
}: {
  params: Promise<{ rid: string }>;
}) {
  const { rid } = use(params);
  const { setIsLoading } = useLoading();
  const { userContext, isReady } = useAuth();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const action = searchParams.get("action") || "view";

  const [selectedTab, setSelectedTab] = useState(action);
  const [requestData, setRequestData] = useState<RequestOrder>(
    {} as RequestOrder
  );
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });
  const [formValues, setFormValues] = useState<{
    comment: string;
  }>({
    comment: "",
  });

  const fetchRequestWithTask = async ({
    token,
    requestId,
  }: {
    token: string;
    requestId: number;
  }) => {
    try {
      const request: RequestOrder = await getRequestOrderWithTask({
        token: token,
        requestId: requestId,
      });
      setRequestData({
        ...request,
        work_order_number: `${request.ae_area?.name}${request.operation_area?.operation_area}${request.ap_year ? Number(request.created_at?.toLocaleString().slice(0, 4)) + 543 : ""}/${request.run_number || ""}`,
      });
    } catch (error) {
      console.error("Failed to fetch request with task:", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (
      isReady &&
      userContext.id &&
      userContext.token &&
      userContext.role &&
      userContext.operationAreaId &&
      rid
    ) {
      const fetchData = async (): Promise<any> => {
        try {
          setRequestData({} as RequestOrder);
          await fetchRequestWithTask({
            token: userContext.token,
            requestId: Number(rid),
          });
        } catch (error) {
          console.error("Failed to fetch:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [userContext, isReady, rid]);

  const inputFields: FormSection[] = [
    {
      fields: [
        [
          {
            type: "textarea",
            name: "comment",
            label: "กรุณาระบุเหตุผล",
            isRequired: true,
            minRows: 5,
            maxRows: 8,
          },
        ],
      ],
    },
  ];

  const handleTabChange = (key: React.Key) => {
    if (typeof key === "string") {
      setSelectedTab(key);

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("action");

      const newQuery = newSearchParams.toString();
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
  };

  const handleFormValueChange = (newValues: typeof formValues) => {
    setFormValues(newValues);
  };

  const handleCancel = () => setFormValues({ comment: "" });

  const handleSubmit = async (status: REQUESTORDERSTATUS): Promise<any> => {
    if (
      isReady &&
      userContext.id &&
      userContext.token &&
      userContext.role &&
      userContext.operationAreaId &&
      rid
    ) {
      setIsLoading(true);
      if (!formValues.comment.trim()) {
        setAlert({
          title: "Alert",
          description: `Detail: กรุณาระบุเหตุผล`,
          color: "warning",
          isVisible: true,
        });
        setIsLoading(false);
        return;
      }
      try {
        const paramData = {
          status: (status as REQUESTORDERSTATUS) || undefined,
          comment: (formValues.comment as string) || undefined,
        };
        await SetStatusRequestOrder({
          token: userContext.token,
          rid: Number(rid),
          paramData: paramData,
        });
        setAlert({
          title: "Success",
          description: `Detail: ${formValues.comment}`,
          color: "success",
          isVisible: true,
        });
        setTimeout(() => {
          router.push(`/list`);
        }, 1000);
      } catch (err: any) {
        setAlert({
          title: "Fail",
          description: err.message || "Unknown error occurred",
          color: "danger",
          isVisible: true,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setAlert({
        title: "Failed to load user profile",
        description: "Please login and try again.",
        color: "danger",
        isVisible: true,
      });
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/login`);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {alert.isVisible && (
        <AlertComponent
          isCompact={true}
          title={alert.title}
          description={alert.description}
          color={alert.color}
          isVisible={alert.isVisible}
          handleClose={() => setAlert({ ...alert, isVisible: false })}
        />
      )}
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className="flex flex-col justify-center items-center p-0 w-full font-semibold"
      >
        {/* View tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="view"
          title="รายละเอียด"
          className="flex flex-col justify-center items-center gap-8 w-full"
        >
          <Header
            title="ดูรายละเอียดใบสั่งงาน"
            subtitle={requestData.work_order_number}
            subtitleClassName={clsx(
              "mt-1 font-mono text-gray-600 text-sm",
              fontMono.variable
            )}
            hasBorder={false}
          />

          <Button
            size="lg"
            radius="sm"
            color="danger"
            variant="flat"
            className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl font-semibold"
            onPress={() => {
              setIsLoading(true);
              router.push(`/list`);
            }}
          >
            ย้อนกลับ
          </Button>
        </Tab>

        {/* Edit tab ----------------------------------------------------------------------------------------- */}
        <Tab
          key="edit"
          title="แก้ไข"
          className="flex flex-col justify-center items-center w-full"
        >
          <Header
            title="แก้รายละเอียดใบสั่งงาน"
            subtitle={requestData.work_order_number}
            subtitleClassName={clsx(
              "mt-1 font-mono text-gray-600 text-sm",
              fontMono.variable
            )}
            hasBorder={false}
          />
          <FormComponent
            isCompact={true}
            sections={inputFields}
            submitLabel="ส่งความคิดเห็น"
            cancelLabel="ยกเลิก"
            onSubmit={() => {
              handleSubmit(REQUESTORDERSTATUS.PendingEdit);
            }}
            onCancel={handleCancel}
            values={formValues}
            onChange={handleFormValueChange}
          />
        </Tab>

        {/* Reject tab ----------------------------------------------------------------------------------------- */}
        <Tab
          key="reject"
          title="ยกเลิก"
          className="flex flex-col justify-center items-center w-full"
        >
          <Header
            title="สาเหตุการปฏิเสธงาน"
            subtitle={requestData.work_order_number}
            subtitleClassName={clsx(
              "mt-1 font-mono text-gray-600 text-sm",
              fontMono.variable
            )}
            hasBorder={false}
          />
          <FormComponent
            isCompact={true}
            sections={inputFields}
            submitLabel="ส่งความคิดเห็น"
            cancelLabel="ยกเลิก"
            onSubmit={() => {
              handleSubmit(REQUESTORDERSTATUS.Rejected);
            }}
            onCancel={handleCancel}
            values={formValues}
            onChange={handleFormValueChange}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
function setAlert(arg0: {
  title: string;
  description: any;
  color: string;
  isVisible: boolean;
}) {
  throw new Error("Function not implemented.");
}
