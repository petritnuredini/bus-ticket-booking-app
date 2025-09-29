import React, { useState } from "react";
import { Form, Button, Select, message, Alert } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function DeleteSatellitesForm({ planets, onSatellitesDeleted }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await axiosInstance.delete(
        "/satellites/by-planet-name",
        {
          data: {
            emrin: values.emrin, // Planet name
          },
        }
      );

      if (response.data.success) {
        message.success(response.data.message);
        form.resetFields();
        if (onSatellitesDeleted) {
          onSatellitesDeleted(
            response.data.data.deletedCount,
            response.data.data.planetName
          );
        }
      } else {
        message.error(response.data.message || "Failed to delete satellites");
      }
    } catch (error) {
      console.error("Error deleting satellites:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting satellites: " + error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Alert
        message="Soft Delete Operation"
        description="This will mark all satellites of the selected planet as deleted (IsDeleted = true). The satellites will be hidden from normal views but not permanently removed from the database."
        type="warning"
        showIcon
        className="mb-4"
      />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Planet Name (emrin)"
          name="emrin"
          rules={[{ required: true, message: "Please select planet!" }]}
          help="Select the planet whose satellites you want to delete"
        >
          <Select
            placeholder="Select planet to delete its satellites"
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
                  {planet.Name} ({planet.Type})
                  {planet.satellites &&
                    planet.satellites.length > 0 &&
                    ` - ${planet.satellites.length} satellites`}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            danger
            htmlType="submit"
            loading={loading}
            size="large"
            block
            disabled={!planets || planets.length === 0}
          >
            Delete All Satellites of Selected Planet
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
              <strong>emrin:</strong> Planet name whose satellites to delete
            </li>
          </ul>
          <p className="text-xs mt-2 text-gray-600">
            Note: This operation sets IsDeleted = true for all satellites of the
            specified planet. Deleted satellites will be hidden from normal
            views (IsDeleted = true).
          </p>
        </div>
      </Form>
    </div>
  );
}

export default DeleteSatellitesForm;
