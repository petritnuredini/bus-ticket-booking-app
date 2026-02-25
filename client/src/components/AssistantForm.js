import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function AssistantForm({
  showAssistantForm,
  setShowAssistantForm,
  getData,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);

  const loadDepartments = async () => {
    try {
      const res = await axiosInstance.get("/departments");
      if (res.data.success) setDepartments(res.data.data);
    } catch (e) {}
  };

  useEffect(() => {
    if (showAssistantForm) loadDepartments();
  }, [showAssistantForm]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post("/assistants/add", values);
      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        getData();
        setShowAssistantForm(false);
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      open={showAssistantForm}
      title="Add Assistant"
      onCancel={() => {
        setShowAssistantForm(false);
        form.resetFields();
      }}
      footer={false}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Emri" name="emri" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mbiemri" name="mbiemri" rules={[{ required: true, message: "Required" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Pozita" name="pozita">
          <Input />
        </Form.Item>

        <Form.Item
          label="Departamenti"
          name="departmentId"
          rules={[{ required: true, message: "Select department" }]}
        >
          <Select
            placeholder="Select"
            options={departments.map((d) => ({ label: d.emriDepartamentit, value: d._id }))}
          />
        </Form.Item>

        <button className="primary-contained-btn w-full" type="submit">
          Save
        </button>
      </Form>
    </Modal>
  );
}

export default AssistantForm;