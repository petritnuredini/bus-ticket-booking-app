import React, { useState } from "react";
import { Table, Button, Tag, Space, Popconfirm, message } from "antd";
import { ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";

function PlanetList({
  planets,
  loading,
  onRefresh,
  onPlanetDeleted,
  showTypeOnly = false,
}) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (planetId) => {
    try {
      setDeleting(planetId);

      const response = await axiosInstance.delete(`/planets/${planetId}`);

      if (response.data.success) {
        message.success(response.data.message);
        if (onPlanetDeleted) {
          onPlanetDeleted(planetId, response.data.data.deletedSatellitesCount);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.data.message || "Failed to delete planet");
      }
    } catch (error) {
      console.error("Error deleting planet:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting planet: " + error.message
      );
    } finally {
      setDeleting(null);
    }
  };
  const columns = [
    {
      title: "Planet ID",
      dataIndex: "PlanetId",
      key: "PlanetId",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      render: (type) => <Tag color="blue">{type}</Tag>,
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
  ];

  // Add satellites column if not showing type only
  if (!showTypeOnly) {
    columns.push({
      title: "Satellites",
      dataIndex: "satellites",
      key: "satellites",
      render: (satellites) => (
        <div>
          {satellites && satellites.length > 0 ? (
            <div>
              <Tag color="cyan">{satellites.length} satellites</Tag>
              <div className="text-xs mt-1">
                {satellites
                  .slice(0, 3)
                  .map((sat) => sat.Name)
                  .join(", ")}
                {satellites.length > 3 && "..."}
              </div>
            </div>
          ) : (
            <Tag color="default">No satellites</Tag>
          )}
        </div>
      ),
    });
  }

  columns.push({
    title: "Created",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => new Date(date).toLocaleDateString(),
    width: 120,
  });

  // Add Actions column if not showing type only
  if (!showTypeOnly) {
    columns.push({
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          {!record.IsDeleted && (
            <Popconfirm
              title="Delete Planet"
              description={`Are you sure you want to delete "${record.Name}"? This will also delete all its satellites.`}
              onConfirm={() => handleDelete(record.PlanetId)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                loading={deleting === record.PlanetId}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold">
          Planets ({planets?.length || 0})
        </h4>
        <Button
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          size="small"
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={planets}
        rowKey="PlanetId"
        loading={loading}
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showQuickJumper: false,
        }}
        scroll={{ x: 600 }}
      />

      {planets && planets.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No planets found.</p>
          <p className="text-xs">
            Create your first planet using the form above.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlanetList;
