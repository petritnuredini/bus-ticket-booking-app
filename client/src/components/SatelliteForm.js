import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function SatelliteForm({ planets, onSatelliteCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("/satellites", {
        Name: values.name,
        PlanetId: values.planetId,
      });

      if (response.data.success) {
        message.success("Satellite created successfully!");
        form.resetFields();
        if (onSatelliteCreated) {
          onSatelliteCreated(response.data.data);
        }
      } else {
        message.error(response.data.message || "Failed to create satellite");
      }
    } catch (error) {
      console.error("Error creating satellite:", error);
      message.error(
        error.response?.data?.message ||
          "Error creating satellite: " + error.message
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
        label="Satellite Name"
        name="name"
        rules={[
          { required: true, message: "Please enter satellite name!" },
          { min: 1, message: "Satellite name must be at least 1 character!" },
          {
            max: 100,
            message: "Satellite name must not exceed 100 characters!",
          },
        ]}
      >
        <Input
          placeholder="Enter satellite name (e.g., Phobos, Triton)"
          size="large"
        />
      </Form.Item>

      <Form.Item
        label="Planet"
        name="planetId"
        rules={[{ required: true, message: "Please select a planet!" }]}
      >
        <Select
          placeholder="Select planet for this satellite"
          size="large"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {planets
            .filter((planet) => !planet.IsDeleted)
            .map((planet) => (
              <Option key={planet.PlanetId} value={planet.PlanetId}>
                {planet.Name} ({planet.Type})
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
          disabled={!planets || planets.length === 0}
        >
          Create Satellite
        </Button>
      </Form.Item>

      {(!planets || planets.length === 0) && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-700">
            No planets available. Please create a planet first.
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-semibold mb-2">Example Data:</h4>
        <code className="text-xs">
          {JSON.stringify(
            {
              SatelliteId: 1,
              Name: "Phobos",
              PlanetId: 1,
            },
            null,
            2
          )}
        </code>
      </div>
    </Form>
  );
}

export default SatelliteForm;
