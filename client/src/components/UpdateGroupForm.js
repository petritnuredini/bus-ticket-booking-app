import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;
const { TextArea } = Input;

function UpdateGroupForm({ groups, onGroupUpdated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Handle group selection
  const handleGroupSelect = (groupId) => {
    const group = groups.find((g) => g.GroupID === groupId);
    if (group) {
      setSelectedGroup(group);
      form.setFieldsValue({
        groupName: group.GroupName,
        description: group.Description || "",
      });
    }
  };

  // Clear form when groups change
  useEffect(() => {
    if (!groups || groups.length === 0) {
      setSelectedGroup(null);
      form.resetFields();
    }
  }, [groups, form]);

  const handleSubmit = async (values) => {
    if (!selectedGroup) {
      message.error("Please select a group to update");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/groups/${selectedGroup.GroupID}`,
        {
          GroupName: values.groupName,
          Description: values.description,
        }
      );

      if (response.data.success) {
        message.success(response.data.message || "Group updated successfully!");
        if (onGroupUpdated) {
          onGroupUpdated(response.data.data);
        }
        // Keep the form populated with updated data
        setSelectedGroup(response.data.data);
      } else {
        message.error(response.data.message || "Failed to update group");
      }
    } catch (error) {
      console.error("Error updating group:", error);
      message.error(
        error.response?.data?.message ||
          "Error updating group: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedGroup(null);
    form.resetFields();
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
          label="Select Group to Update"
          name="selectedGroupId"
          rules={[{ required: true, message: "Please select a group!" }]}
          help="Choose which group you want to update"
        >
          <Select
            placeholder="Select a group to update"
            size="large"
            showSearch
            allowClear
            optionFilterProp="children"
            onChange={handleGroupSelect}
            onClear={handleClear}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {groups
              ?.filter((group) => !group.IsDeleted)
              .map((group) => (
                <Option key={group.GroupID} value={group.GroupID}>
                  {group.GroupName}
                  {group.Description &&
                    ` - ${group.Description.substring(0, 50)}${
                      group.Description.length > 50 ? "..." : ""
                    }`}
                </Option>
              ))}
          </Select>
        </Form.Item>

        {selectedGroup && (
          <>
            <Form.Item
              label="Group Name"
              name="groupName"
              rules={[
                { required: true, message: "Please enter group name!" },
                {
                  min: 2,
                  message: "Group name must be at least 2 characters!",
                },
                {
                  max: 100,
                  message: "Group name cannot exceed 100 characters!",
                },
              ]}
              help="Update the group name"
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
                {
                  max: 500,
                  message: "Description cannot exceed 500 characters!",
                },
              ]}
              help="Update the group description"
            >
              <TextArea
                placeholder="Enter group description (optional)"
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  style={{ flex: 1 }}
                >
                  Update Group
                </Button>
                <Button type="default" onClick={handleClear} size="large">
                  Clear
                </Button>
              </div>
            </Form.Item>
          </>
        )}

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
              <strong>GroupID:</strong> ID of the group to update (selected from
              dropdown)
            </li>
            <li>
              <strong>GroupName:</strong> New name for the group (required,
              2-100 characters)
            </li>
            <li>
              <strong>Description:</strong> New description (optional, max 500
              characters)
            </li>
          </ul>
          <p className="text-xs mt-2 text-gray-600">
            Note: Group names must be unique. Select a group from the dropdown
            to populate the form with current values, then modify as needed.
          </p>
        </div>
      </Form>
    </div>
  );
}

export default UpdateGroupForm;
