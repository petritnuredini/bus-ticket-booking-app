import React, { useState } from "react";
import { Form, Button, Select, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function UpdatePlanetTypeForm({ planets, onPlanetTypeUpdated }) {
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

      const response = await axiosInstance.put("/planets/update-type", {
        emrin: values.emrin, // Planet name (old name)
        tipin: values.tipin, // New type
      });

      if (response.data.success) {
        message.success("Planet type updated successfully!");
        form.resetFields();
        if (onPlanetTypeUpdated) {
          onPlanetTypeUpdated(response.data.data);
        }
      } else {
        message.error(response.data.message || "Failed to update planet type");
      }
    } catch (error) {
      console.error("Error updating planet type:", error);
      message.error(
        error.response?.data?.message ||
          "Error updating planet type: " + error.message
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
        label="Planet Name (emrin)"
        name="emrin"
        rules={[
          { required: true, message: "Please select or enter planet name!" },
        ]}
        help="Select the planet whose type you want to change"
      >
        <Select
          placeholder="Select planet to update"
          size="large"
          showSearch
          allowClear
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {planets
            .filter((planet) => !planet.IsDeleted)
            .map((planet) => (
              <Option key={planet.PlanetId} value={planet.Name}>
                {planet.Name} (Current: {planet.Type})
              </Option>
            ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="New Planet Type (tipin)"
        name="tipin"
        rules={[
          {
            required: true,
            message: "Please select or enter new planet type!",
          },
        ]}
        help="Select or type the new type for this planet"
      >
        <Select
          placeholder="Select or type new planet type"
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
          disabled={!planets || planets.length === 0}
        >
          Update Planet Type
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
        <h4 className="text-sm font-semibold mb-2">Parameters:</h4>
        <ul className="text-xs space-y-1">
          <li>
            <strong>emrin:</strong> Planet name (old name to find)
          </li>
          <li>
            <strong>tipin:</strong> New planet type to set
          </li>
        </ul>
      </div>
    </Form>
  );
}

export default UpdatePlanetTypeForm;
