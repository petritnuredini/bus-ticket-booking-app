import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Tag, Collapse, List } from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";

const { Panel } = Collapse;

function GroupList({
  groups,
  loading,
  onRefresh,
  onGroupDeleted,
  showMembersInline = false,
}) {
  const [groupMembers, setGroupMembers] = useState({});
  const [loadingMembers, setLoadingMembers] = useState({});

  // Fetch members for a specific group
  const fetchGroupMembers = async (groupId) => {
    if (groupMembers[groupId]) return; // Already loaded

    setLoadingMembers((prev) => ({ ...prev, [groupId]: true }));
    try {
      const response = await axiosInstance.get(`/groups/${groupId}/members`);
      if (response.data.success) {
        setGroupMembers((prev) => ({
          ...prev,
          [groupId]: response.data.data,
        }));
      }
    } catch (error) {
      console.error("Error fetching group members:", error);
    } finally {
      setLoadingMembers((prev) => ({ ...prev, [groupId]: false }));
    }
  };

  // Handle group deletion
  const handleDelete = async (groupId, groupName) => {
    try {
      const response = await axiosInstance.delete(`/groups/${groupId}`);
      if (response.data.success) {
        message.success(response.data.message);
        if (onGroupDeleted) {
          onGroupDeleted(groupId);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.data.message || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting group: " + error.message
      );
    }
  };

  // Handle cascade deletion (group + all members)
  const handleCascadeDelete = async (groupId, groupName) => {
    try {
      const response = await axiosInstance.delete(`/groups/${groupId}/cascade`);
      if (response.data.success) {
        message.success(response.data.message);
        if (onGroupDeleted) {
          onGroupDeleted(groupId, response.data.deletedMembersCount);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.data.message || "Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting group: " + error.message
      );
    }
  };

  const columns = [
    {
      title: "Group ID",
      dataIndex: "GroupID",
      key: "GroupID",
      width: 100,
      sorter: (a, b) => a.GroupID - b.GroupID,
    },
    {
      title: "Group Name",
      dataIndex: "GroupName",
      key: "GroupName",
      sorter: (a, b) => a.GroupName.localeCompare(b.GroupName),
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          {showMembersInline && (
            <div className="mt-1">
              <Button
                size="small"
                type="link"
                icon={<TeamOutlined />}
                onClick={() => fetchGroupMembers(record.GroupID)}
                loading={loadingMembers[record.GroupID]}
              >
                {groupMembers[record.GroupID]
                  ? `${groupMembers[record.GroupID].length} members`
                  : "Load members"}
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      render: (text) =>
        text || <span className="text-gray-400">No description</span>,
    },
    {
      title: "Created",
      dataIndex: "CreatedAt",
      key: "CreatedAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Delete Group"
            description={`Are you sure you want to delete "${record.GroupName}"? This will only delete the group if it has no members.`}
            onConfirm={() => handleDelete(record.GroupID, record.GroupName)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>

          <Popconfirm
            title="Delete Group & Members"
            description={`Are you sure you want to delete "${record.GroupName}" and ALL its members? This action cannot be undone.`}
            onConfirm={() =>
              handleCascadeDelete(record.GroupID, record.GroupName)
            }
            okText="Yes, Delete All"
            cancelText="No"
            okType="danger"
          >
            <Button
              type="primary"
              danger
              size="small"
              style={{ backgroundColor: "#ff7875", borderColor: "#ff7875" }}
            >
              Delete All
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Render members for a group
  const renderGroupMembers = (groupId) => {
    const members = groupMembers[groupId];
    if (!members) return null;

    return (
      <div className="mt-2 p-2 bg-gray-50 rounded">
        <h5 className="text-sm font-semibold mb-2">
          Members ({members.length}):
        </h5>
        {members.length > 0 ? (
          <List
            size="small"
            dataSource={members}
            renderItem={(member) => (
              <List.Item>
                <div className="flex justify-between items-center w-full">
                  <div>
                    <strong>{member.Name}</strong>
                    <Tag color="blue" className="ml-2">
                      {member.Role}
                    </Tag>
                  </div>
                  <span className="text-xs text-gray-500">
                    ID: {member.MemberID}
                  </span>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <p className="text-sm text-gray-500">No members in this group</p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Groups ({groups?.length || 0})
        </h3>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={groups}
        loading={loading}
        rowKey="GroupID"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} groups`,
        }}
        expandable={
          showMembersInline
            ? {
                expandedRowRender: (record) =>
                  renderGroupMembers(record.GroupID),
                expandRowByClick: true,
              }
            : undefined
        }
      />

      {(!groups || groups.length === 0) && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>No groups found. Create your first group to get started!</p>
        </div>
      )}
    </div>
  );
}

export default GroupList;
