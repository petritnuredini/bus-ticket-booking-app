import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function MemberForm({ groups, onMemberCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/members", {
        Name: values.name,
        Role: values.role,
        GroupID: values.groupId,
      });

      if (response.data.success) {
        message.success(
          response.data.message || "Member created successfully!"
        );
        form.resetFields();
        if (onMemberCreated) {
          onMemberCreated(response.data.data);
        }
      } else {
        message.error(response.data.message || "Failed to create member");
      }
    } catch (error) {
      console.error("Error creating member:", error);
      message.error(
        error.response?.data?.message ||
          "Error creating member: " + error.message
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
          label="Member Name"
          name="name"
          rules={[
            { required: true, message: "Please enter member name!" },
            { min: 2, message: "Member name must be at least 2 characters!" },
            { max: 100, message: "Member name cannot exceed 100 characters!" },
          ]}
          help="Enter the full name of the member"
        >
          <Input
            placeholder="Enter member name"
            size="large"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[
            { required: true, message: "Please enter member role!" },
            { min: 2, message: "Role must be at least 2 characters!" },
            { max: 50, message: "Role cannot exceed 50 characters!" },
          ]}
          help="Enter the role or position of the member"
        >
          <Input
            placeholder="Enter member role (e.g., Leader, Developer, Designer)"
            size="large"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Group"
          name="groupId"
          rules={[{ required: true, message: "Please select a group!" }]}
          help="Select which group this member belongs to"
        >
          <Select
            placeholder="Select a group"
            size="large"
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {groups
              ?.filter((group) => !group.IsDeleted)
              .map((group) => (
                <Option key={group.GroupID} value={group.GroupID}>
                  {group.GroupName}
                  {group.Description && ` - ${group.Description}`}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            disabled={!groups || groups.length === 0}
          >
            Create Member
          </Button>
        </Form.Item>

        {(!groups || groups.length === 0) && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-700">
              No groups available. Please create a group first.
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-semibold mb-2">Parameters:</h4>
          <ul className="text-xs space-y-1">
            <li>
              <strong>Name:</strong> Member's full name (required, 2-100
              characters)
            </li>
            <li>
              <strong>Role:</strong> Member's role or position (required, 2-50
              characters)
            </li>
            <li>
              <strong>GroupID:</strong> ID of the group the member belongs to
              (required)
            </li>
          </ul>
          <p className="text-xs mt-2 text-gray-600">
            Note: The member will be associated with the selected group. The
            system will automatically assign a MemberID when the member is
            created.
          </p>
        </div>
      </Form>
    </div>
  );
}

export default MemberForm;
