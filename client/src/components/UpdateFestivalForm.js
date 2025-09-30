import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button, message, Card } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function UpdateFestivalForm({ festivals, onFestivalUpdated, onRefresh }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);

  const handleFestivalSelect = (festivalId) => {
    const festival = festivals.find((f) => f.FestivalID === festivalId);
    if (festival) {
      setSelectedFestival(festival);
      form.setFieldsValue({
        EmriFestivalit: festival.EmriFestivalit,
        LlojiiFestivalit: festival.LlojiiFestivalit,
      });
    }
  };

  const handleSubmit = async (values) => {
    if (!selectedFestival) {
      message.error("Please select a festival first");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/festivals/${selectedFestival.FestivalID}`,
        values
      );

      if (response.data.success) {
        message.success("Festival updated successfully!");
        if (onFestivalUpdated) {
          onFestivalUpdated(response.data.data);
        }
        if (onRefresh) {
          onRefresh();
        }
        form.resetFields();
        setSelectedFestival(null);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update festival"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form.Item label="Select Festival to Update">
        <Select
          placeholder="Select a festival"
          onChange={handleFestivalSelect}
          value={selectedFestival?.FestivalID}
          showSearch
          optionFilterProp="children"
        >
          {festivals.map((festival) => (
            <Option key={festival.FestivalID} value={festival.FestivalID}>
              {festival.EmriFestivalit}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {selectedFestival && (
        <Card title="Update Festival Information" size="small" className="mt-4">
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Festival Name (Emri i Festivalit)"
              name="EmriFestivalit"
              rules={[
                { required: true, message: "Please enter festival name" },
                { min: 2, message: "Name must be at least 2 characters" },
                { max: 100, message: "Name must not exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter festival name" />
            </Form.Item>

            <Form.Item
              label="Festival Type (Lloji i Festivalit)"
              name="LlojiiFestivalit"
              rules={[
                { max: 50, message: "Type must not exceed 50 characters" },
              ]}
            >
              <Input placeholder="Enter festival type (optional)" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Festival
              </Button>
              <Button
                className="ml-2"
                onClick={() => {
                  form.resetFields();
                  setSelectedFestival(null);
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}
    </div>
  );
}

export default UpdateFestivalForm;

