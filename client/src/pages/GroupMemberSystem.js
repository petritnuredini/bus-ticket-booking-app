import React, { useState, useEffect } from "react";
import { Row, Col, Card, message, Tabs, Button } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import GroupForm from "../components/GroupForm";
import MemberForm from "../components/MemberForm";
import GroupList from "../components/GroupList";
import MemberList from "../components/MemberList";
import UpdateGroupForm from "../components/UpdateGroupForm";
import { axiosInstance } from "../helpers/axiosInstance";

const { TabPane } = Tabs;

function GroupMemberSystem() {
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch groups from API
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/groups");
      if (response.data.success) {
        setGroups(response.data.data);
      } else {
        message.error("Failed to fetch groups");
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      message.error("Error fetching groups: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members from API
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/members");
      if (response.data.success) {
        setMembers(response.data.data);
      } else {
        message.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      message.error("Error fetching members: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGroups();
    fetchMembers();
  }, []);

  // Handle group creation
  const handleGroupCreated = (newGroup) => {
    setGroups([newGroup, ...groups]);
    message.success("Group created successfully!");
  };

  // Handle member creation
  const handleMemberCreated = (newMember) => {
    setMembers([newMember, ...members]);
    message.success("Member created successfully!");
  };

  // Handle group update
  const handleGroupUpdated = (updatedGroup) => {
    setGroups(
      groups.map((group) =>
        group.GroupID === updatedGroup.GroupID ? updatedGroup : group
      )
    );
    message.success("Group updated successfully!");
  };

  // Handle group deletion
  const handleGroupDeleted = (groupId, deletedMembersCount = 0) => {
    setGroups(groups.filter((group) => group.GroupID !== groupId));
    // Also refresh members list to remove deleted members
    fetchMembers();
    if (deletedMembersCount > 0) {
      message.success(
        `Group deleted successfully along with ${deletedMembersCount} members!`
      );
    } else {
      message.success("Group deleted successfully!");
    }
  };

  // Handle member deletion
  const handleMemberDeleted = (memberId) => {
    setMembers(members.filter((member) => member.MemberID !== memberId));
    message.success("Member deleted successfully!");
  };

  return (
    <div className="p-5">
      {/* Navigation Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Group-Member Management System
        </h1>
        <Link to="/">
          <Button type="primary" icon={<HomeOutlined />}>
            Back to Home
          </Button>
        </Link>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="System Overview" size="small">
            <p className="text-gray-600 mb-4">
              Manage groups and their members. Create groups, add members to
              groups, update group information, and delete members as needed.
            </p>

            <Tabs defaultActiveKey="1" type="card">
              {/* Tab 1: Insert Group */}
              <TabPane tab="Insert Group" key="1">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Create New Group" size="small">
                      <GroupForm onGroupCreated={handleGroupCreated} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Groups List" size="small">
                      <GroupList
                        groups={groups}
                        loading={loading}
                        onRefresh={fetchGroups}
                        onGroupDeleted={handleGroupDeleted}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 2: Insert Member */}
              <TabPane tab="Insert Member" key="2">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Create New Member" size="small">
                      <MemberForm
                        groups={groups}
                        onMemberCreated={handleMemberCreated}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Members List" size="small">
                      <MemberList
                        members={members}
                        groups={groups}
                        loading={loading}
                        onRefresh={fetchMembers}
                        onMemberDeleted={handleMemberDeleted}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 3: Update Group */}
              <TabPane tab="Update Group" key="3">
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Update Group Information" size="small">
                      <UpdateGroupForm
                        groups={groups}
                        onGroupUpdated={handleGroupUpdated}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Current Groups" size="small">
                      <GroupList
                        groups={groups}
                        loading={loading}
                        onRefresh={fetchGroups}
                        onGroupDeleted={handleGroupDeleted}
                        showMembersInline={true}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              {/* Tab 4: Delete Members */}
              <TabPane tab="Delete Members" key="4">
                <Card title="Member Management" size="small">
                  <p className="text-gray-600 mb-4">
                    View all members and delete individual members or multiple
                    members at once. Use the checkboxes to select multiple
                    members for bulk deletion.
                  </p>
                  <MemberList
                    members={members}
                    groups={groups}
                    loading={loading}
                    onRefresh={fetchMembers}
                    onMemberDeleted={handleMemberDeleted}
                    showFilterOptions={true}
                  />
                </Card>
              </TabPane>

              {/* Tab 5: Groups Overview */}
              <TabPane tab="Groups" key="5">
                <Card title="All Groups" size="small">
                  <p className="text-gray-600 mb-4">
                    Complete overview of all groups. Click on a group row to
                    expand and see its members.
                  </p>
                  <GroupList
                    groups={groups}
                    loading={loading}
                    onRefresh={fetchGroups}
                    onGroupDeleted={handleGroupDeleted}
                    showMembersInline={true}
                  />
                </Card>
              </TabPane>

              {/* Tab 6: Members Overview */}
              <TabPane tab="Members" key="6">
                <Card title="All Members" size="small">
                  <p className="text-gray-600 mb-4">
                    Complete overview of all members with group filtering
                    options. Use the filter dropdown to view members by specific
                    groups.
                  </p>
                  <MemberList
                    members={members}
                    groups={groups}
                    loading={loading}
                    onRefresh={fetchMembers}
                    onMemberDeleted={handleMemberDeleted}
                    showFilterOptions={true}
                  />
                </Card>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default GroupMemberSystem;
