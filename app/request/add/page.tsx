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
import {
  Activity,
  FormField,
  TaskOrder,
  RequestOrder,
  UploadedFile,
} from "@/interfaces/interfaces";

import { Tab, Tabs, Divider, Button } from "@heroui/react";

import FormComponent from "@/components/FormComponent";
import UploadComponent from "@/components/UploadComponent";
import AlertComponent, {
  AlertComponentProps,
} from "@/components/AlertComponent";

import { getActivities } from "@/libs/activityAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import { KeyInRequestOrder, uploadRequestOrder } from "@/libs/requestOrderAPI";
import { AddIcon, MinusIcon } from "@/utils/icons";

export default function AddRequestPage() {
  // const value & react hook -------------------------------------------------------------------------------------
  // * For key-in form
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [activityOptions, setActivityOptions] = useState([]);
  const [operationAreaOptions, setOperationAreaOptions] = useState([]);
  const [activityWithTools, setActivityWithTools] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<TaskOrder[]>([]);
  const [formValues, setFormValues] = useState<RequestOrder>(
    {} as RequestOrder
  );

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
  useEffect(() => {
    const fetchDropDownOptions = async ({ token }: { token: string }) => {
      const activity = await getActivities({ token });
      const operation_area = await getOperationAreas({ token });
      setOperationAreaOptions(operation_area);

      setActivityWithTools(activity);
      setActivityOptions(
        activity.map((activity: Activity) => ({
          label: activity.name,
          value: activity.name,
        }))
      );

      setFormValues({
        activities: "",
        tool_types: "",
        ap_year: currentYear,
        ap_month: currentMonth,
      } as RequestOrder);

      setTasks([
        {
          activity_name: "",
          tool_type_name: "",
        },
      ] as TaskOrder[]);
    };

    fetchDropDownOptions({ token: userContext.token });
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
    console.log(
      "Attempting to upload files with Axios:",
      uploadedFiles.map((f) => f.name)
    );

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
        setFormValues({} as RequestOrder);
      }, 500);
    }
  };

  const handleCancelKeyIn = () => {
    setFormValues({} as RequestOrder);
  };

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      { activity_name: "", tool_type_name: "" },
    ] as TaskOrder[]);
  };

  const handleRemoveTask = () => {
    if (tasks.length > 1) {
      setTasks(tasks.slice(0, -1));
    }
  };

  const handleTaskChange = (index: number, changed: any) => {
    const updatedTasks: TaskOrder[] = tasks.map((task, i) => {
      if (i === index) {
        if (changed.activity_name !== undefined) {
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
        name: "operation_area_id",
        isRequired: true,
        translator: RequestOrderTranslation,
        className: "w-1/3",
        options: [
          ...operationAreaOptions.map((option: any) => ({
            label: option.operation_area,
            value: option.id,
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
    <div className="flex flex-col w-full justify-center items-center">
      <Tabs
        aria-label="TabOptions"
        radius="sm"
        className="p-0 flex flex-col w-full justify-center items-center font-semibold"
      >
        {/* Key-in tab ------------------------------------------------------------------------------------------- */}
        <Tab
          key="key-in"
          title="Key-in"
          className="flex flex-col w-full justify-center items-center"
        >
          <FormComponent
            fields={requestOrderFields}
            title="สร้างใบสั่งงาน"
            subtitle="กรุณากรอกข้อมูลใบสั่งงานลงในฟอร์มด้านล่าง"
            isSubmitting={isAdding}
            onCancel={handleCancelKeyIn}
            onSubmit={handleSubmitKeyIn}
            onChange={handleRequestOrderChange}
          >
            <div className="flex flex-col gap-4 w-full justify-center items-center">
              {/* Task Header */}
              <div className="flex items-center gap-5 w-full">
                <span className="font-semibold text-xl text-gray-700">
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
                const selectedActivity = activityWithTools.find(
                  (activity) => String(activity.name) === task.activity_name
                );

                const toolTypeOptions =
                  selectedActivity && selectedActivity.tool_types
                    ? selectedActivity.tool_types.map((t: any) => ({
                        label: t.tool_type_name,
                        value: t.tool_type_name,
                      }))
                    : [];

                return (
                  <FormComponent
                    key={idx + "-" + (task.activity_name || "")}
                    hasHeader={false}
                    hasButtons={false}
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
          className="flex flex-col w-full justify-center items-center"
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
