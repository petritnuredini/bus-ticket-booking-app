import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";

function FestivalForm({ onFestivalCreated, onRefresh }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/festivals", values);

      if (response.data.success) {
        message.success("Festival created successfully!");
        form.resetFields();
        if (onFestivalCreated) {
          onFestivalCreated(response.data.data);
        }
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to create festival"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        rules={[{ max: 50, message: "Type must not exceed 50 characters" }]}
      >
        <Input placeholder="Enter festival type (optional)" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Festival
        </Button>
      </Form.Item>
    </Form>
  );
}

export default FestivalForm;

