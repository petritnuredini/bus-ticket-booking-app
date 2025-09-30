import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { TextArea } = Input;

function GroupForm({ onGroupCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/groups", {
        GroupName: values.groupName,
        Description: values.description,
      });

      if (response.data.success) {
        message.success(response.data.message || "Group created successfully!");
        form.resetFields();
        if (onGroupCreated) {
          onGroupCreated(response.data.data);
        }
      } else {
        message.error(response.data.message || "Failed to create group");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      message.error(
        error.response?.data?.message ||
          "Error creating group: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Group Name"
          name="groupName"
          rules={[
            { required: true, message: "Please enter group name!" },
            { min: 2, message: "Group name must be at least 2 characters!" },
            { max: 100, message: "Group name cannot exceed 100 characters!" },
          ]}
          help="Enter a unique name for the group"
        >
          <Input
            placeholder="Enter group name"
            size="large"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { max: 500, message: "Description cannot exceed 500 characters!" },
          ]}
          help="Optional description for the group"
        >
          <TextArea
            placeholder="Enter group description (optional)"
            rows={4}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            Create Group
          </Button>
        </Form.Item>

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-semibold mb-2">Parameters:</h4>
          <ul className="text-xs space-y-1">
            <li>
              <strong>GroupName:</strong> Name of the group (required, 2-100
              characters)
            </li>
            <li>
              <strong>Description:</strong> Optional description (max 500
              characters)
            </li>
          </ul>
          <p className="text-xs mt-2 text-gray-600">
            Note: Group names must be unique. The system will automatically
            assign a GroupID when the group is created.
          </p>
        </div>
      </Form>
    </div>
  );
}

export default GroupForm;
