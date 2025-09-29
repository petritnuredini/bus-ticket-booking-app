import React, { useState } from "react";
import { Table, Button, Tag, Space, Input, message, Popconfirm } from "antd";
import {
  ReloadOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";

function SatelliteList({
  satellites,
  loading,
  onRefresh,
  onSatelliteDeleted,
  showFilterOptions = false,
}) {
  const [excludeId, setExcludeId] = useState("");
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (satelliteId) => {
    try {
      setDeleting(satelliteId);

      const response = await axiosInstance.delete(`/satellites/${satelliteId}`);

      if (response.data.success) {
        message.success("Satellite deleted successfully!");
        if (onSatelliteDeleted) {
          onSatelliteDeleted(satelliteId);
        }
      } else {
        message.error(response.data.message || "Failed to delete satellite");
      }
    } catch (error) {
      console.error("Error deleting satellite:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting satellite: " + error.message
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleFilterByExcludeId = () => {
    if (excludeId.trim()) {
      onRefresh(excludeId.trim());
    } else {
      onRefresh();
    }
  };

  const columns = [
    {
      title: "Satellite ID",
      dataIndex: "SatelliteId",
      key: "SatelliteId",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Planet",
      dataIndex: "planet",
      key: "planet",
      render: (planet) => (
        <div>
          <div>{planet?.Name}</div>
          <Tag color="blue" size="small">
            {planet?.Type}
          </Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "IsDeleted",
      key: "IsDeleted",
      render: (isDeleted) => (
        <Tag color={isDeleted ? "red" : "green"}>
          {isDeleted ? "Deleted" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          {!record.IsDeleted && (
            <Popconfirm
              title="Delete Satellite"
              description="Are you sure you want to delete this satellite?"
              onConfirm={() => handleDelete(record.SatelliteId)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={deleting === record.SatelliteId}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold">
          Satellites ({satellites?.length || 0})
        </h4>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => onRefresh()}
          size="small"
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {showFilterOptions && (
        <div className="mb-3 p-3 bg-gray-50 rounded">
          <h5 className="text-xs font-semibold mb-2">Filter Options:</h5>
          <Input.Group compact>
            <Input
              style={{ width: "calc(100% - 80px)" }}
              placeholder="Enter Satellite ID to exclude (ID-ne parameter)"
              value={excludeId}
              onChange={(e) => setExcludeId(e.target.value)}
              size="small"
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFilterByExcludeId}
              size="small"
              style={{ width: "80px" }}
            >
              Filter
            </Button>
          </Input.Group>
          <p className="text-xs text-gray-600 mt-1">
            This will hide the satellite with the specified ID from the results.
          </p>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={satellites}
        rowKey="SatelliteId"
        loading={loading}
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
        scroll={{ x: 700 }}
      />

      {satellites && satellites.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No satellites found.</p>
          <p className="text-xs">
            Create your first satellite using the form above.
          </p>
        </div>
      )}
    </div>
  );
}

export default SatelliteList;
