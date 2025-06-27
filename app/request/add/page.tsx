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

import { getActivities } from "@/libs/activityAPI";
import { getCustomerTypes } from "@/libs/customerTypeAPI";
import { getOperationAreas } from "@/libs/operationAreaAPI";
import { uploadRequestOrder } from "@/libs/requestOrderAPI";

export default function AddRequestPage() {
  // const value & react hook -------------------------------------------------------------------------------------
  // * For key-in form
  const { userContext } = useAuth();
  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = monthList[now.getMonth()].value;

  const [activityOptions, setActivityOptions] = useState([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [operationAreaOptions, setOperationAreaOptions] = useState([]);
  const [activityWithTools, setActivityWithTools] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<TaskOrder[]>([]);
  const [formValues, setFormValues] = useState<RequestOrder>(
    {} as RequestOrder
  );

  // * For file upload
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  // Fetch data ---------------------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchDropDownOptions = async () => {
      const customer_type = await getCustomerTypes();
      const activity = await getActivities();

      setCustomerTypeOptions(customer_type);
      setActivityWithTools(activity);
      setActivityOptions(
        activity.map((activity: Activity) => ({
          label: activity.name,
          value: activity.name,
        }))
      );

      setTasks([
        {
          activity_name: "",
          tool_type_name: "",
        },
      ] as TaskOrder[]);
    };

    fetchDropDownOptions();
  }, []);

  useEffect(() => {
    if (userContext.ae_id !== null) {
      setFormValues({
        ae_id: userContext?.ae_id,
        activities: "",
        tool_types: "",
        ap_year: currentYear,
        ap_month: currentMonth,
        created_by: userContext?.id,
      } as RequestOrder);
    }

    const fetchOperationAreas = async (params: any) => {
      const operation_area = await getOperationAreas(params);
      setOperationAreaOptions(operation_area);
    };

    fetchOperationAreas({
      ae_id: userContext.ae_id,
    });
  }, [userContext]);

  // Handler ------------------------------------------------------------------------------------------------------
  // TODO: Change button to "Downloaded!" and disable it for a sec.
  const handleDownloadTemplate = (): void => {
    const link = document.createElement("a");

    link.href = "/excel/request_orders_template.xlsx";
    link.download = "request_orders_template.xlsx";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  // TODO: Handle Alerts: use Alert component instead of window.alert
  const handleSubmitUpload = async (_e?: any): Promise<void> => {
    if (uploadedFiles.length === 0) {
      alert("Please upload files before confirming.");
      return;
    }

    setIsUploading(true);
    console.log(
      "Attempting to upload files with Axios:",
      uploadedFiles.map((f) => f.name)
    );

    // TODO: Handle success
    // * After successful upload, reset the uploadedFiles state
    // * Change the button to "Uploaded!" and disable it for a sec.
    try {
      const response = await uploadRequestOrder(
        uploadedFiles,
        userContext.ae_id!,
        userContext.id!
      );

      alert("Upload successful!");
    } catch (error) {
      // TODO: Handle error
      // * Show an error message to the user
      // * Use Alert component instead of console.error

      alert("Upload failed!");
    } finally {
      // TODO: Remove timeout
      setTimeout(() => {
        setIsUploading(false);
        setUploadedFiles([]);
      }, 500);
    }
  };

  const handleCancelUpload = (_e?: any): void => {
    alert("Cancelling upload, Clear form");
    setUploadedFiles([]);
  };

  const handleRequestOrderChange = (values: any) => {
    setFormValues(values);
  };

  const handleSubmitKeyIn = () => {
    console.log("Task : ", tasks);

    const activities = tasks.map((t) => t.activity_name).join("+");
    const tool_types = tasks.map((t) => t.tool_type_name).join("+");

    const submitValue = {
      ...formValues,
      activities,
      tool_types,
    };

    console.log("Submitting form with values:", submitValue);

    setFormValues(submitValue);
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

  // TODO: Handler change activity make tool ""
  // TODO: implement dropdown warning 
  const handleTaskChange = (index: number, changed: any) => {
    const updatedTasks: TaskOrder[] = tasks.map((task, i) => {
      console.log("Updating task at index:", i, "with changes:", changed);

      if (i === index) {
        return { ...task, ...changed };
      }

      return task;
    });

    setTasks(updatedTasks);
  };

  // Field configurations ----------------------------------------------------------------------------------------
  const requestOrderFields: FormField[] = [
    {
      type: "dropdown",
      isRequired: true,
      name: "customer_type_id",
      translator: RequestOrderTranslation,
      options: [
        ...customerTypeOptions.map((option: any) => ({
          label: option.name,
          value: String(option.id),
        })),
      ],
    },
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
      isRequired: true,
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

                <Button
                  size="md"
                  radius="sm"
                  color="default"
                  variant="flat"
                  className="tracking-normal"
                  onPress={handleAddTask}
                >
                  เพิ่มกิจกรรม
                </Button>
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
                    key={idx}
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
            isUploading={isUploading}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            onSubmit={handleSubmitUpload}
            onCancel={handleCancelUpload}
            onDownloadTemplate={handleDownloadTemplate}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
