import React, { useState } from "react";
import { Table, Button, message, Popconfirm, Tag, Select } from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { axiosInstance } from "../helpers/axiosInstance";

const { Option } = Select;

function MemberList({
  members,
  groups,
  loading,
  onRefresh,
  onMemberDeleted,
  showFilterOptions = false,
}) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterGroupId, setFilterGroupId] = useState(null);

  // Handle individual member deletion
  const handleDelete = async (memberId, memberName) => {
    try {
      const response = await axiosInstance.delete(`/members/${memberId}`);
      if (response.data.success) {
        message.success(response.data.message);
        if (onMemberDeleted) {
          onMemberDeleted(memberId);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.data.message || "Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting member: " + error.message
      );
    }
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select members to delete");
      return;
    }

    try {
      const response = await axiosInstance.post("/members/bulk-delete", {
        memberIds: selectedRowKeys,
      });

      if (response.data.success) {
        message.success(response.data.message);
        setSelectedRowKeys([]);
        if (onRefresh) {
          onRefresh();
        }
      } else {
        message.error(response.data.message || "Failed to delete members");
      }
    } catch (error) {
      console.error("Error bulk deleting members:", error);
      message.error(
        error.response?.data?.message ||
          "Error deleting members: " + error.message
      );
    }
  };

  // Filter members by group
  const filteredMembers = filterGroupId
    ? members?.filter(
        (member) =>
          member.GroupID === filterGroupId ||
          (member.Group && member.Group.GroupID === filterGroupId)
      )
    : members;

  const columns = [
    {
      title: "Member ID",
      dataIndex: "MemberID",
      key: "MemberID",
      width: 100,
      sorter: (a, b) => a.MemberID - b.MemberID,
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "Role",
      render: (text) => <Tag color="blue">{text}</Tag>,
      sorter: (a, b) => a.Role.localeCompare(b.Role),
    },
    {
      title: "Group",
      key: "Group",
      render: (_, record) => {
        const groupName =
          record.Group?.GroupName ||
          groups?.find((g) => g.GroupID === record.GroupID)?.GroupName ||
          "Unknown Group";
        return <Tag color="green">{groupName}</Tag>;
      },
      sorter: (a, b) => {
        const aGroup =
          a.Group?.GroupName ||
          groups?.find((g) => g.GroupID === a.GroupID)?.GroupName ||
          "";
        const bGroup =
          b.Group?.GroupName ||
          groups?.find((g) => g.GroupID === b.GroupID)?.GroupName ||
          "";
        return aGroup.localeCompare(bGroup);
      },
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
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Delete Member"
          description={`Are you sure you want to delete "${record.Name}"?`}
          onConfirm={() => handleDelete(record.MemberID, record.Name)}
          okText="Yes"
          cancelText="No"
          okType="danger"
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            Members ({filteredMembers?.length || 0})
          </h3>

          {showFilterOptions && groups && groups.length > 0 && (
            <div className="flex items-center gap-2">
              <FilterOutlined />
              <Select
                placeholder="Filter by group"
                allowClear
                style={{ width: 200 }}
                value={filterGroupId}
                onChange={setFilterGroupId}
              >
                {groups.map((group) => (
                  <Option key={group.GroupID} value={group.GroupID}>
                    {group.GroupName}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Bulk Delete Members"
              description={`Are you sure you want to delete ${selectedRowKeys.length} selected members?`}
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <Button type="primary" danger>
                Delete Selected ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          )}

          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredMembers}
        loading={loading}
        rowKey="MemberID"
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} members`,
        }}
      />

      {(!filteredMembers || filteredMembers.length === 0) && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>
            {filterGroupId
              ? "No members found in the selected group."
              : "No members found. Create your first member to get started!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default MemberList;
