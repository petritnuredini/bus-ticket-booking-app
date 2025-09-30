import React from "react";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";
import moment from "moment";

function FestivalList({
  festivals,
  loading,
  onRefresh,
  onFestivalDeleted,
  showEvents = false,
  showDeleteOnly = false,
}) {
  const handleDelete = async (festivalId) => {
    try {
      const response = await axiosInstance.delete(`/festivals/${festivalId}`);
      if (response.data.success) {
        message.success("Festival deleted successfully!");
        if (onFestivalDeleted) {
          onFestivalDeleted(festivalId);
        }
        if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to delete festival"
      );
    }
  };

  const columns = [
    {
      title: "Festival ID",
      dataIndex: "FestivalID",
      key: "FestivalID",
      width: 100,
    },
    {
      title: "Festival Name",
      dataIndex: "EmriFestivalit",
      key: "EmriFestivalit",
    },
    {
      title: "Festival Type",
      dataIndex: "LlojiiFestivalit",
      key: "LlojiiFestivalit",
      render: (type) => type || <span className="text-gray-400">N/A</span>,
    },
    {
      title: "Events Count",
      key: "eventsCount",
      render: (_, record) => (
        <Tag color="blue">{record.events?.length || 0} events</Tag>
      ),
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
          title="Are you sure you want to delete this festival?"
          description="This will also delete all associated events."
          onConfirm={() => handleDelete(record.FestivalID)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Expandable row configuration for showing events
  const expandedRowRender = (record) => {
    const eventColumns = [
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
      },
    ];

    return (
      <Table
        columns={eventColumns}
        dataSource={record.events || []}
        pagination={false}
        rowKey="EventID"
        locale={{ emptyText: "No events for this festival" }}
      />
    );
  };

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={festivals}
        loading={loading}
        rowKey="FestivalID"
        pagination={{ pageSize: 10 }}
        expandable={
          showEvents
            ? {
                expandedRowRender,
                rowExpandable: (record) => record.events?.length > 0,
              }
            : undefined
        }
      />
    </div>
  );
}

export default FestivalList;

