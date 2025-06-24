import type {
  FieldConfig,
  StatusConfig,
  RequestOrder,
} from "@/interfaces/interfaces";

import React from "react";

import Header from "@/components/Header";
import getRequestOrder from "@/libs/requestOrderAPI";
import { CardComponent } from "@/components/CardComponent";
import { RequestOrderStatusColorMap, RequestOrderStatusTranslation, RequestOrderTranslation } from "@/utils/constants";
import { mockRequestOrders } from "@/utils/mock";

export default async function RequestPage() {
  const headerFields: FieldConfig[] = [
    {
      key: "customer_type",
      label: "Customer Type",
      className: "font-bold text-lg text-left",
      translation: RequestOrderTranslation,
    },
  ];

  const bodyFields: FieldConfig[] = [
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
      className: "font-medium text-left pb-3",
      translation: RequestOrderTranslation,
    },
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

  const mockData: RequestOrder[] = mockRequestOrders;
  // const data: RequestOrder[] = (await getRequestOrder()).data;

  const statusConfig: StatusConfig = {
    colorMap: RequestOrderStatusColorMap,
    translation: RequestOrderStatusTranslation,
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
