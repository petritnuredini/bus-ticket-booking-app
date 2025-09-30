import React from "react";
import { Table, Button, Tag, Popconfirm, message } from "antd";
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";
import moment from "moment";

function EventList({ events, festivals, loading, onRefresh, onEventDeleted }) {
  const handleDelete = async (eventId) => {
    try {
      const response = await axiosInstance.delete(`/events/${eventId}`);
      if (response.data.success) {
        message.success("Event deleted successfully!");
        if (onEventDeleted) {
          onEventDeleted(eventId);
        }
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete event");
    }
  };
  const columns = [
    {
      title: "Event ID",
      dataIndex: "EventID",
      key: "EventID",
      width: 100,
    },
    {
      title: "Event Name",
      dataIndex: "EmriEventit",
      key: "EmriEventit",
    },
    {
      title: "Event Date",
      dataIndex: "DataEventit",
      key: "DataEventit",
      render: (date) => moment(date).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.DataEventit) - new Date(b.DataEventit),
    },
    {
      title: "Festival",
      dataIndex: "ID_Festivalit",
      key: "festival",
      render: (festivalId, record) => {
        // Try to get festival name from the included festival object
        if (record.festival) {
          return <Tag color="green">{record.festival.EmriFestivalit}</Tag>;
        }
        // Fallback to finding in festivals array
        const festival = festivals.find((f) => f.FestivalID === festivalId);
        return festival ? (
          <Tag color="green">{festival.EmriFestivalit}</Tag>
        ) : (
          <Tag color="red">Unknown Festival</Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      render: (date) => moment(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this event?"
          onConfirm={() => handleDelete(record.EventID)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={events}
        loading={loading}
        rowKey="EventID"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default EventList;
