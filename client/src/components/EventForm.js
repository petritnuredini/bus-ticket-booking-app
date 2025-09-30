import React, { useState } from "react";
import { Form, Input, Select, DatePicker, Button, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function EventForm({ festivals, onEventCreated, onRefresh }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        ID_Festivalit: values.ID_Festivalit,
        EmriEventit: values.EmriEventit,
        DataEventit: values.DataEventit.format("YYYY-MM-DD"),
      };

      const response = await axiosInstance.post("/events", payload);

      if (response.data.success) {
        message.success("Event created successfully!");
        form.resetFields();
        if (onEventCreated) {
          onEventCreated(response.data.data);
        }
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Select Festival"
        name="ID_Festivalit"
        rules={[{ required: true, message: "Please select a festival" }]}
      >
        <Select placeholder="Select a festival" showSearch optionFilterProp="children">
          {festivals.map((festival) => (
            <Option key={festival.FestivalID} value={festival.FestivalID}>
              {festival.EmriFestivalit}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Event Name (Emri i Eventit)"
        name="EmriEventit"
        rules={[
          { required: true, message: "Please enter event name" },
          { min: 2, message: "Name must be at least 2 characters" },
          { max: 100, message: "Name must not exceed 100 characters" },
        ]}
      >
        <Input placeholder="Enter event name" />
      </Form.Item>

      <Form.Item
        label="Event Date (Data e Eventit)"
        name="DataEventit"
        rules={[{ required: true, message: "Please select event date" }]}
      >
        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Event
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EventForm;

