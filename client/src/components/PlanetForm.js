import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function PlanetForm({ onPlanetCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Common planet types
  const planetTypes = [
    "Terrestrial",
    "Gas Giant",
    "Ice Giant",
    "Dwarf Planet",
    "Rocky Planet",
    "Ocean Planet",
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/planets", {
        Name: values.name,
        Type: values.type,
      });

      if (response.data.success) {
        message.success("Planet created successfully!");
        form.resetFields();
        if (onPlanetCreated) {
          onPlanetCreated(response.data.data);
        }
      } else {
        message.error(response.data.message || "Failed to create planet");
      }
    } catch (error) {
      console.error("Error creating planet:", error);
      message.error(
        error.response?.data?.message ||
          "Error creating planet: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Planet Name"
        name="name"
        rules={[
          { required: true, message: "Please enter planet name!" },
          { min: 2, message: "Planet name must be at least 2 characters!" },
          { max: 100, message: "Planet name must not exceed 100 characters!" },
        ]}
      >
        <Input
          placeholder="Enter planet name (e.g., Venus, Mars)"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Planet Type"
        name="type"
        rules={[
          { required: true, message: "Please select or enter planet type!" },
        ]}
      >
        <Select
          placeholder="Select or type planet type"
          size="large"
          showSearch
          allowClear
          optionFilterProp="children"
        >
          {planetTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
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
        >
          Create Planet
        </Button>
      </Form.Item>

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-semibold mb-2">Example Data:</h4>
        <code className="text-xs">
          {JSON.stringify(
            {
              PlanetId: 1,
              Name: "Venus",
              Type: "Terrestrial",
            },
            null,
            2
          )}
        </code>
      </div>
    </Form>
  );
}

export default PlanetForm;
