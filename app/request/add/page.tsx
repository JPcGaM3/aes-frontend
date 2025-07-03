"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

import {
  yearList,
  monthList,
  RequestOrderTranslation,
  TaskOrderTranslation,
} from "@/utils/constants";
import { Activity, OperationArea, RequestOrder, ToolType } from "@/interfaces/schema";
import { AlertComponentProps } from "@/interfaces/props";
import { DropdownOption, FormField, UploadedFile } from "@/interfaces/interfaces";

import { Tab, Tabs, Divider, Button } from "@heroui/react";

import FormComponent from "@/components/FormComponent";
import UploadComponent from "@/components/UploadComponent";
import AlertComponent from "@/components/AlertComponent";

import { getActivities } from "@/libs/activityAPI";
import { getOperationAreasUser } from "@/libs/operationAreaAPI";
import { KeyInRequestOrder, uploadRequestOrder } from "@/libs/requestOrderAPI";
import { AddIcon, MinusIcon } from "@/utils/icons";

interface FormType extends RequestOrder {
  activities: string;
  tool_types: string;
}

interface TaskFormType {
  activity_name: string;
  tool_type_name: string;
}

interface OperationAreaResponse {
  operation_area: OperationArea;
}

export default function AddRequestPage() {
  // const value & react hook -------------------------------------------------------------------------------------
  // * For key-in form
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = monthList[now.getMonth()].value;

  const [operationAreaOptions, setOperationAreaOptions] = useState<OperationAreaResponse[]>([]);
  const [activityWithTools, setActivityWithTools] = useState<Activity[]>([]);
  const [activityOptions, setActivityOptions] = useState<DropdownOption[]>([]);
  const [tasks, setTasks] = useState<TaskFormType[]>([]);
  const [formValues, setFormValues] = useState<FormType>({
    activities: "",
    tool_types: "",
    ap_year: currentYear,
    ap_month: currentMonth,
  } as FormType);

  // * For file upload
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // * Other
  const [alert, setAlert] = useState<AlertComponentProps>({
    title: "",
    description: "",
    isVisible: false,
  });

  // Fetch data ---------------------------------------------------------------------------------------------------
  // TODO: core fetch function
  useEffect(() => {
    if (userContext.token && userContext.operationAreaId) {
      const fetchDropDownOptions = async ({
        token,
        operation_area_id,
      }: {
        token: string;
        operation_area_id: number;
      }) => {
        const activity = await getActivities({ token });
        const operation_area = await getOperationAreasUser({ token });

        setOperationAreaOptions(operation_area);
        setActivityWithTools(activity);
        setActivityOptions(
          activity.map((activity: Activity) => ({
            label: activity.name,
            value: activity.name,
          }))
        );

        setFormValues({
          ...formValues,
          operation_area_id: operation_area_id,
          customer_operation_area_id: operation_area_id,
        } as FormType);

        setTasks([
          {
            activity_name: "",
            tool_type_name: "",
          },
        ]);
      };

      fetchDropDownOptions({
        token: userContext.token,
        operation_area_id: userContext.operationAreaId,
      });
    }
  }, [userContext]);

  // Handler ------------------------------------------------------------------------------------------------------
  const handleDownloadTemplate = (): void => {
    const link = document.createElement("a");

    link.href = "/excel/request_orders_template.xlsx";
    link.download = "request_orders_template.xlsx";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitUpload = async (_e?: any): Promise<void> => {
    if (uploadedFiles.length === 0) {
      setAlert({
        isVisible: true,
        color: "danger",
        title: "Upload Error",
        description: "Please upload files before confirming.",
      });

      return;
    }

    setIsAdding(true);

    try {
      const response = await uploadRequestOrder({
        token: userContext.token,
        uploadedFiles: uploadedFiles,
      });

      setAlert({
        isVisible: true,
        color: "success",
        title: "Upload Successful",
        description: "Upload successful!",
      });
    } catch (error) {
      setAlert({
        isVisible: true,
        color: "danger",
        title: "Upload Failed",
        description: "Upload failed!, error: " + error,
      });
    } finally {
      setTimeout(() => {
        setIsAdding(false);
        setUploadedFiles([]);
      }, 500);
    }
  };

  const handleCancelUpload = (_e?: any): void => {
    setAlert({
      isVisible: true,
      title: "Upload Cancelled",
      description: "Cancelling upload, Clear form",
      color: "warning",
    });

    setUploadedFiles([]);
  };

  const handleRequestOrderChange = (values: any) => {
    const updateValues = {
      ...formValues,
      ...values,
    };

    setFormValues(updateValues);
  };

  const handleSubmitKeyIn = async () => {
    console.log("Tasks : ", tasks);

    const activities = tasks.map((t) => t.activity_name).join("+");
    const tool_types = tasks.map((t) => t.tool_type_name).join("+");

    const submitValue = {
      ...formValues,
      activities,
      tool_types,
    };

    setFormValues(submitValue);

    try {
      const response = await KeyInRequestOrder({
        token: userContext.token,
        data: submitValue,
      });

      setAlert({
        isVisible: true,
        title: "Add Request Order Successful",
        description: "Add request order successful!",
        color: "success",
      });
    } catch (error) {
      setAlert({
        isVisible: true,
        title: "Add Request Order Failed",
        description: "Add order failed!",
        color: "danger",
      });
    } finally {
      setTimeout(() => {
        setIsAdding(false);
        setFormValues({} as FormType);
      }, 500);
    }
  };

  const handleCancelKeyIn = () => {
    setFormValues({} as FormType);
  };

  const handleAddTask = () => {
    setTasks([...tasks, { activity_name: "", tool_type_name: "" }]);
  };

  const handleRemoveTask = () => {
    if (tasks.length > 1) {
      setTasks(tasks.slice(0, -1));
    }
  };

  const handleTaskChange = (index: number, changed: any) => {
    console.log("Task changed: ", index, changed);

    const updatedTasks: TaskFormType[] = tasks.map((task, i) => {
      if (i === index) {
        if (
          changed.activity_name !== undefined &&
          changed.activity_name !== task.activity_name
        ) {
          return { ...task, ...changed, tool_type_name: "" };
        }
        return { ...task, ...changed };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // Field configurations ----------------------------------------------------------------------------------------
  const requestOrderFields: FormField[] = [
    {
      type: "text",
      name: "phone",
      translator: RequestOrderTranslation,
    },
    [
      {
        type: "dropdown",
        name: "customer_operation_area_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: [
          ...operationAreaOptions.map((option: OperationAreaResponse) => ({
            label: option.operation_area.operation_area ?? "",
            value: option.operation_area.id,
          })),
        ],
      },
      {
        type: "text",
        name: "zone",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "text",
        name: "quota_number",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
      },
      {
        type: "text",
        name: "farmer_name",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
      },
    ],
    [
      {
        type: "dropdown",
        name: "ap_year",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: yearList,
      },
      {
        type: "dropdown",
        name: "ap_month",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-2/3",
        options: monthList,
      },
    ],
    {
      type: "text",
      name: "supervisor_name",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "number",
      name: "target_area",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "text",
      name: "land_number",
      isRequired: true,
      translator: RequestOrderTranslation,
    },
    {
      type: "textarea",
      name: "location_xy",
      isRequired: false,
      translator: RequestOrderTranslation,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        className="flex flex-col items-center justify-center w-full p-0 font-semibold"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="key-in"
          title="Key-in"
          className="flex flex-col items-center justify-center w-full"
        >
          <FormComponent
            fields={requestOrderFields}
            title="สร้างใบสั่งงาน"
            subtitle="กรุณากรอกข้อมูลใบสั่งงานลงในฟอร์มด้านล่าง"
            initialValues={formValues}
            isSubmitting={isAdding}
            onCancel={handleCancelKeyIn}
            onSubmit={handleSubmitKeyIn}
            onChange={handleRequestOrderChange}
          >
            <div className="flex flex-col items-center justify-center w-full gap-4">
              {/* Task Header */}
              <div className="flex items-center w-full gap-5">
                <span className="text-xl font-semibold text-gray-700">
                  กิจกรรม
                </span>

                <Divider className="flex-1" />

                <div className="flex flex-row gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    color="default"
                    variant="flat"
                    startContent={<AddIcon />}
                    onPress={handleAddTask}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    radius="sm"
                    color="default"
                    variant="flat"
                    startContent={<MinusIcon />}
                    onPress={handleRemoveTask}
                  />
                </div>
              </div>

              {/* Task Fields */}
              {tasks.map((task, idx) => {
                const selectedActivity: Activity | undefined = activityWithTools.find(
                  (activity) => String(activity.name) === task.activity_name
                );

                const toolTypeOptions =
                  selectedActivity && selectedActivity.tool_types
                    ? selectedActivity.tool_types.map((t: ToolType) => ({
                        label: t.tool_type_name,
                        value: t.tool_type_name,
                      }))
                    : [];

                return (
                  <FormComponent
                    key={idx + "-" + (task.activity_name || "")}
                    hasHeader={false}
                    initialValues={task}
                    onChange={(changed: any) => handleTaskChange(idx, changed)}
                    fields={[
                      [
                        {
                          type: "dropdown",
                          name: "activity_name",
                          isRequired: true,
                          translator: TaskOrderTranslation,
                          options: activityOptions,
                          className: "w-1/2",
                        },
                        {
                          type: "dropdown",
                          name: "tool_type_name",
                          isRequired: true,
                          translator: TaskOrderTranslation,
                          options: toolTypeOptions,
                          className: "w-1/2",
                        },
                      ],
                    ]}
                  />
                );
              })}
            </div>
          </FormComponent>
        </Tab>

        {/* Upload tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="upload"
          title="Upload"
          className="flex flex-col items-center justify-center w-full"
        >
          <UploadComponent
            maxFiles={5}
            isUploading={isAdding}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onSubmit={handleSubmitUpload}
            onCancel={handleCancelUpload}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </Tab>
      </Tabs>

      {/* Alert */}
      {alert.isVisible && (
        <AlertComponent
          title={alert.title}
          description={alert.description}
          color={alert.color}
          isVisible={alert.isVisible}
          handleClose={() => setAlert({ ...alert, isVisible: false })}
        />
      )}
    </div>
  );
}
