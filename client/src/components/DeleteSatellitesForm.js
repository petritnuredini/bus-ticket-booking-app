import React, { useState } from "react";
import { Form, Button, Select, message, Alert, List, Tag, Spin } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function DeleteSatellitesForm({ planets, onSatellitesDeleted }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [planetSatellites, setPlanetSatellites] = useState([]);
  const [loadingSatellites, setLoadingSatellites] = useState(false);

  // Fetch satellites when planet is selected
  const fetchPlanetSatellites = async (planetId) => {
    if (!planetId) {
      setPlanetSatellites([]);
      return;
    }

    try {
      setLoadingSatellites(true);
      const response = await axiosInstance.get(
        `/satellites/by-planet/${planetId}`
      );
      if (response.data.success) {
        setPlanetSatellites(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching planet satellites:", error);
      setPlanetSatellites([]);
    } finally {
      setLoadingSatellites(false);
    }
  };

  // Handle planet selection change
  const handlePlanetChange = (planetName) => {
    const selectedPlanet = planets.find((p) => p.Name === planetName);
    if (selectedPlanet) {
      setSelectedPlanetId(selectedPlanet.PlanetId);
      fetchPlanetSatellites(selectedPlanet.PlanetId);
    } else {
      setSelectedPlanetId(null);
      setPlanetSatellites([]);
    }
  };

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
    <div className="flex gap-4">
      {/* Left side - Form */}
      <div className="flex-1">
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
              onChange={handlePlanetChange}
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
              disabled={
                !planets ||
                planets.length === 0 ||
                planetSatellites.length === 0
              }
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
              Note: This operation sets IsDeleted = true for all satellites of
              the specified planet. Deleted satellites will be hidden from
              normal views (IsDeleted = true).
            </p>
          </div>
        </Form>
      </div>

      {/* Right side - Satellites Preview */}
      <div className="flex-1">
        <div className="p-4 border rounded bg-white">
          <h4 className="text-sm font-semibold mb-3">
            Satellites to be Deleted
            {selectedPlanetId && (
              <span className="ml-2 text-gray-500">
                ({planetSatellites.length} satellites)
              </span>
            )}
          </h4>

          {loadingSatellites ? (
            <div className="text-center py-8">
              <Spin size="large" />
              <p className="mt-2 text-gray-500">Loading satellites...</p>
            </div>
          ) : selectedPlanetId ? (
            planetSatellites.length > 0 ? (
              <List
                size="small"
                dataSource={planetSatellites}
                renderItem={(satellite) => (
                  <List.Item>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <strong>{satellite.Name}</strong>
                        <div className="text-xs text-gray-500">
                          ID: {satellite.SatelliteId}
                        </div>
                      </div>
                      <Tag color="red">Will be deleted</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active satellites found for this planet.</p>
                <p className="text-xs">Nothing to delete.</p>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p>Select a planet to preview its satellites</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteSatellitesForm;
