import React, { useState, useEffect } from "react";
import { Modal, Form, Row, Col, message } from "antd";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function DailyBusForm({
  showDailyBusForm,
  setShowDailyBusForm,
  type = "add",
  getData,
  selectedDailyBus,
  setSelectedDailyBus,
}) {
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [activeDays, setActiveDays] = useState([1, 2, 3, 4, 5, 6]); // Monday to Saturday by default
  const [scheduleVariations, setScheduleVariations] = useState({}); // Day-specific time overrides
  const [showVariations, setShowVariations] = useState(false);

  const daysOfWeek = [
    { value: 0, label: "Sunday", short: "Sun" },
    { value: 1, label: "Monday", short: "Mon" },
    { value: 2, label: "Tuesday", short: "Tue" },
    { value: 3, label: "Wednesday", short: "Wed" },
    { value: 4, label: "Thursday", short: "Thu" },
    { value: 5, label: "Friday", short: "Fri" },
    { value: 6, label: "Saturday", short: "Sat" },
  ];

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());

      // Prepare the data with active days and schedule variations
      const formData = {
        ...values,
        activeDays: activeDays,
        scheduleVariations: scheduleVariations,
      };

      let response = null;
      if (type === "add") {
        response = await axiosInstance.post(
          "/api/daily-buses/add-daily-bus",
          formData
        );
      } else {
        response = await axiosInstance.put(
          `/api/daily-buses/${selectedDailyBus.id}`,
          formData
        );
      }

      if (response.data.success) {
        message.success(response.data.message);
        getData();
        setShowDailyBusForm(false);
        setSelectedDailyBus(null);
      } else {
        message.error(response.data.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleDayToggle = (dayValue) => {
    setActiveDays((prev) => {
      if (prev.includes(dayValue)) {
        // Don't allow removing all days
        if (prev.length === 1) {
          message.warning("At least one day must be selected");
          return prev;
        }
        // Remove day-specific variations when day is deactivated
        const newVariations = { ...scheduleVariations };
        delete newVariations[dayValue];
        setScheduleVariations(newVariations);
        return prev.filter((day) => day !== dayValue);
      } else {
        return [...prev, dayValue].sort();
      }
    });
  };

  const handleVariationChange = (dayValue, field, value) => {
    setScheduleVariations((prev) => ({
      ...prev,
      [dayValue]: {
        ...prev[dayValue],
        [field]: value,
      },
    }));
  };

  const removeVariation = (dayValue) => {
    setScheduleVariations((prev) => {
      const newVariations = { ...prev };
      delete newVariations[dayValue];
      return newVariations;
    });
  };

  useEffect(() => {
    // Fetch cities for dropdown
    axiosInstance.get("/api/cities/get-all-cities").then((response) => {
      setCities(response.data.data);
    });

    // Set initial values when editing
    if (selectedDailyBus && type === "edit") {
      setActiveDays(selectedDailyBus.activeDays || [1, 2, 3, 4, 5, 6]);
      setScheduleVariations(selectedDailyBus.scheduleVariations || {});
    } else {
      setActiveDays([1, 2, 3, 4, 5, 6]); // Reset to default for new form
      setScheduleVariations({});
    }
  }, [selectedDailyBus, type]);

  return (
    <Modal
      width={900}
      title={
        type === "add" ? "Add Daily Bus Schedule" : "Update Daily Bus Schedule"
      }
      visible={showDailyBusForm}
      onCancel={() => {
        setSelectedDailyBus(null);
        setShowDailyBusForm(false);
        setActiveDays([1, 2, 3, 4, 5, 6]);
        setScheduleVariations({});
        setShowVariations(false);
      }}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedDailyBus}
      >
        <Row gutter={[10, 10]}>
          {/* Bus Name */}
          <Col lg={24} xs={24}>
            <Form.Item
              label="Bus Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter bus name",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                placeholder="Enter bus name"
              />
            </Form.Item>
          </Col>

          {/* Bus Number and Capacity */}
          <Col lg={12} xs={24}>
            <Form.Item
              label="Bus Number"
              name="busNumber"
              rules={[
                {
                  required: true,
                  message: "Please input bus number!",
                },
              ]}
            >
              <input
                type="text"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                placeholder="Enter bus number"
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Capacity"
              name="capacity"
              rules={[
                {
                  required: true,
                  message: "Please input bus capacity!",
                },
              ]}
            >
              <input
                type="number"
                min="1"
                max="100"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                placeholder="Enter capacity"
              />
            </Form.Item>
          </Col>

          {/* From and To */}
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
              <select className="block border border-blue-500 w-full p-3 rounded-lg mb-4">
                <option value="">Select departure city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
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
              <select className="block border border-blue-500 w-full p-3 rounded-lg mb-4">
                <option value="">Select destination city</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </Form.Item>
          </Col>

          {/* Default Times */}
          <Col lg={12} xs={24}>
            <Form.Item
              label="Default Departure Time"
              name="defaultDeparture"
              rules={[
                {
                  required: true,
                  message: "Please input departure time!",
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
              label="Default Arrival Time"
              name="defaultArrival"
              rules={[
                {
                  required: true,
                  message: "Please input arrival time!",
                },
              ]}
            >
              <input
                type="time"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
              />
            </Form.Item>
          </Col>

          {/* Price */}
          <Col lg={12} xs={24}>
            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input price!",
                },
              ]}
            >
              <input
                type="number"
                min="0"
                step="0.01"
                className="block border border-blue-500 w-full p-3 rounded-lg mb-4"
                placeholder="Enter price"
              />
            </Form.Item>
          </Col>

          {/* Status */}
          <Col lg={12} xs={24}>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please select status",
                },
              ]}
            >
              <select className="block border border-blue-500 w-full p-3 rounded-lg mb-4">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </Form.Item>
          </Col>

          {/* Active Days Selection */}
          <Col lg={24} xs={24}>
            <Form.Item label="Active Days" required>
              <div className="border border-blue-500 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.value} className="text-center">
                      <label className="flex flex-col items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={activeDays.includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          className="mb-1"
                        />
                        <span className="text-sm font-medium">{day.short}</span>
                        <span className="text-xs text-gray-600">
                          {day.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Selected days: {activeDays.length} day
                  {activeDays.length !== 1 ? "s" : ""}
                </div>
              </div>
            </Form.Item>
          </Col>

          {/* Schedule Variations */}
          <Col lg={24} xs={24}>
            <Form.Item label="Schedule Variations (Optional)">
              <div className="border border-blue-500 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">
                    Day-specific time overrides
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowVariations(!showVariations)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    {showVariations ? "Hide" : "Show"} Variations
                  </button>
                </div>

                {showVariations && (
                  <div className="space-y-3">
                    {activeDays.map((dayValue) => {
                      const day = daysOfWeek.find((d) => d.value === dayValue);
                      const hasVariation = scheduleVariations[dayValue];

                      return (
                        <div
                          key={dayValue}
                          className="border rounded p-3 bg-gray-50"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{day.label}</span>
                            {hasVariation ? (
                              <button
                                type="button"
                                onClick={() => removeVariation(dayValue)}
                                className="text-red-600 text-sm hover:underline"
                              >
                                Remove Override
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  handleVariationChange(
                                    dayValue,
                                    "departure",
                                    ""
                                  )
                                }
                                className="text-blue-600 text-sm hover:underline"
                              >
                                Add Override
                              </button>
                            )}
                          </div>

                          {hasVariation && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Departure Time
                                </label>
                                <input
                                  type="time"
                                  value={
                                    scheduleVariations[dayValue]?.departure ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleVariationChange(
                                      dayValue,
                                      "departure",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  Arrival Time
                                </label>
                                <input
                                  type="time"
                                  value={
                                    scheduleVariations[dayValue]?.arrival || ""
                                  }
                                  onChange={(e) =>
                                    handleVariationChange(
                                      dayValue,
                                      "arrival",
                                      e.target.value
                                    )
                                  }
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {Object.keys(scheduleVariations).length === 0 && (
                      <div className="text-center text-gray-500 text-sm py-4">
                        No schedule variations set. Default times will be used
                        for all active days.
                      </div>
                    )}
                  </div>
                )}
              </div>
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
              {type === "add" ? "Add Daily Bus" : "Update Daily Bus"}
            </span>
            <span className="absolute inset-0 border-2 border-blue-600 rounded-full"></span>
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default DailyBusForm;
