import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function DepartmentForm({
  showDepartmentForm,
  setShowDepartmentForm,
  type = "add",
  getData,
  selectedDepartment,
  setSelectedDepartment,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/departments/add", values);
      } else {
        response = await axiosInstance.put(
          `/departments/${selectedDepartment._id}`,
          values
        );
      }

      dispatch(HideLoading());

      if (response.data.success) {
        message.success(response.data.message);
        getData();
        setShowDepartmentForm(false);
        setSelectedDepartment(null);
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (type === "edit" && selectedDepartment) {
      form.setFieldsValue({
        emriDepartamentit: selectedDepartment.emriDepartamentit,
        numriZyrave: selectedDepartment.numriZyrave,
      });
    } else {
      form.resetFields();
    }
  }, [type, selectedDepartment, form]);

  return (
    <Modal
      open={showDepartmentForm}
      title={type === "add" ? "Add Department" : "Edit Department"}
      onCancel={() => {
        setShowDepartmentForm(false);
        setSelectedDepartment(null);
        form.resetFields();
      }}
      footer={false}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Emri Departamentit"
          name="emriDepartamentit"
          rules={[{ required: true, message: "Required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Numri Zyrave"
          name="numriZyrave"
          rules={[
            { required: true, message: "Required" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") return Promise.resolve();
                const n = Number(value);
                if (Number.isNaN(n) || n < 0) return Promise.reject(new Error("Must be >= 0"));
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <button className="primary-contained-btn w-full" type="submit">
          Save
        </button>
      </Form>
    </Modal>
  );
}

export default DepartmentForm;