import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Modal, Row, Form, Col, message } from "antd";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import InternationalCitySelect from "./InternationalCitySelect";

function BusForm({
  showBusForm,
  setShowBusForm,
  type = "add",
  getData,
  selectedBus,
  setSelectedBus,
}) {
  const dispatch = useDispatch();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      // Include city values in the form data
      const formData = {
        ...values,
        from: fromCity,
        to: toCity,
      };

      let response = null;
      if (type === "add") {
        response = await axiosInstance.post("/api/buses/add-bus", formData);
      } else {
        response = await axiosInstance.put(
          `/api/buses/${selectedBus._id}`,
          formData
        );
      }
      if (response.data.success) {
        message.success(response.data.message);
      } else {
        message.error(response.data.message);
      }
      getData();
      setShowBusForm(false);
      setSelectedBus(null);
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    // Set initial values when editing
    if (selectedBus && type === "edit") {
      setFromCity(selectedBus.from || "");
      setToCity(selectedBus.to || "");
    } else {
      setFromCity("");
      setToCity("");
    }
  }, [selectedBus, type]);

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      visible={showBusForm}
      onCancel={() => {
        setSelectedBus(null);
        setShowBusForm(false);
        setFromCity("");
        setToCity("");
      }}
      footer={false}
    >
      <Form layout="vertical" onFinish={onFinish} initialValues={selectedBus}>
        <Row gutter={[10, 10]}>
          <Col lg={24} xs={24}>
            <Form.Item
              label="Bus Name"
              name="name"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message:
                    type === "add"
                      ? "Please enter bus name"
                      : "Please enter bus name",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Bus Number"
              name="busNumber"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input bus number!",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input bus capacity!",
                },
              ]}
            >
              <input
                type="number"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="From"
              name="from"
              rules={[
                {
                  required: true,
                  message: "Please select departure city",
                },
              ]}
            >
              <InternationalCitySelect
                value={fromCity}
                onChange={setFromCity}
                placeholder="Select departure city"
                className="mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="To"
              name="to"
              rules={[
                {
                  required: true,
                  message: "Please select destination city",
                },
              ]}
            >
              <InternationalCitySelect
                value={toCity}
                onChange={setToCity}
                placeholder="Select destination city"
                className="mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Journey Date"
              name="journeyDate"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input journey date!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Departure"
              name="departure"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input departure time!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                type="time"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item
              label="Arrival"
              name="arrival"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input arrival time!",
                  validateTrigger: "onSubmit",
                },
              ]}
            >
              <input
                type="time"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: type === "add" ? true : true,
                  message: "Please input price!",
                },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Please enter a valid price with up to 2 decimal places!",
                },
                {
                  validator: (_, value) => {
                    if (value && parseFloat(value) < 0) {
                      return Promise.reject(
                        new Error("Price cannot be negative!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                onKeyPress={(e) => {
                  // Allow only numbers, decimal point, and backspace
                  if (!/[0-9.]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="status" initialValue="Yet to start">
              <select
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                name=""
                id=""
                defaultValue="Yet to start"
              >
                <option value="Yet to start">Yet To Start</option>
                <option value="Running">Running</option>
                <option disabled value="Completed">
                  Completed
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>
        <div className="flex justify-end">
          <button
            type="submit"
            className="relative inline-flex items-center justify-start
                px-10 py-3 overflow-hidden font-bold rounded-full
                group"
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Save
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default BusForm;
