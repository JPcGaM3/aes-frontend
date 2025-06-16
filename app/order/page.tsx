import type {
  FieldConfig,
  StatusConfig,
  RequestOrder,
} from "@/interfaces/interfaces";

import React from "react";

import { REQUESTORDERSTATUS } from "@/utils/enum";
import Header from "@/components/Header";
import { CardComponent } from "@/components/CardComponent";
import { RequestOrderTranslation } from "@/utils/constants";
import { get } from "http";
import getRequestOrder from "@/libs/requestOrderAPI";

async function OrderPage() {
  const headerFields: FieldConfig[] = [
    {
      key: "customer_type",
      label: "Customer Type",
      className: "font-bold text-lg text-left",
      translation: RequestOrderTranslation,
    },
    {
      key: "affiliation",
      label: "Affiliation",
      className: "font-medium text-left",
      translation: RequestOrderTranslation,
    },
    {
      key: "quota_number",
      label: "Quota #",
      className: "font-medium text-left",
      translation: RequestOrderTranslation,
    },
    {
      key: "farm_name",
      label: "Farm Name",
      className: "font-medium text-left",
      translation: RequestOrderTranslation,
    },
  ];

  const bodyFields: FieldConfig[] = [
    {
      key: "ap_month_year",
      label: "Month/Year",
      className: "text-left text-gray-600",
      translation: RequestOrderTranslation,
    },
    {
      key: "supervisor_fullname",
      label: "Supervisor",
      className: "text-left text-gray-600",
      translation: RequestOrderTranslation,
    },
    {
      key: "target_area",
      label: "Target Area",
      className: "text-left text-gray-600",
      translation: RequestOrderTranslation,
    },
  ];

  const mockData: RequestOrder[] = (await getRequestOrder()).data;
  console.log(mockData);

  const statusConfig: StatusConfig = {
    key: "status",
    colorMap: {
      pending: "warning",
      completed: "success",
      cancelled: "danger",
    },
    translation: {
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
    },
  };

  return (
    <div className="w-full px-0">
      <Header subtitle="Please review your order" title="Order Page" />
      <CardComponent
        isActionsPage={true}
        bodyFields={bodyFields}
        headerFields={headerFields}
        items={mockData}
        statusConfig={statusConfig}
      />
    </div>
  );
}

export default OrderPage;
