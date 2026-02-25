import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Select, Table } from "antd";
import AssistantForm from "../../components/AssistantForm";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function AdminAssistants() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [assistants, setAssistants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterDeptId, setFilterDeptId] = useState("");
  const [showAssistantForm, setShowAssistantForm] = useState(false);

  const getDepartments = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/departments");
      if (res.data.success) setDepartments(res.data.data);
    } catch (e) {}
  }, []);

  const getAssistants = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const url = filterDeptId
        ? `/assistants/by-department/${filterDeptId}`
        : "/assistants";

      const response = await axiosInstance.get(url);
      dispatch(HideLoading());

      if (response.data.success) setAssistants(response.data.data);
      else message.error(response.data.message);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, filterDeptId]);

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  useEffect(() => {
    getAssistants();
  }, [getAssistants]);


  

  const columns = [
    { title: "Emri", dataIndex: "emri" },
    { title: "Mbiemri", dataIndex: "mbiemri" },
    { title: "Pozita", dataIndex: "pozita" },
    {
      title: "Departamenti",
      dataIndex: "departmentId",
      render: (dept) => dept?.emriDepartamentit || "",
    },
  ];

  return (
    <>
      <Helmet><title>Admin - Assistants</title></Helmet>

      <div className="flex items-center justify-between">
        <PageTitle title={t("admin.assistants", "Assistants")} />
        <button className="primary-contained-btn" onClick={() => setShowAssistantForm(true)}>
          Add Assistant
        </button>
      </div>

      <div className="my-3 flex gap-3 items-center">
        <div style={{ minWidth: 260 }}>
          <Select
            allowClear
            placeholder="Filter by Department"
            value={filterDeptId || undefined}
            onChange={(val) => setFilterDeptId(val || "")}
            options={departments.map((d) => ({ label: d.emriDepartamentit, value: d._id }))}
            className="w-full"
          />
        </div>

        <button className="primary-outlined-btn" onClick={() => setFilterDeptId("")}>
          Clear
        </button>
      </div>

      <Table rowKey="_id" columns={columns} dataSource={assistants} />

      {showAssistantForm && (
        <AssistantForm
          showAssistantForm={showAssistantForm}
          setShowAssistantForm={setShowAssistantForm}
          getData={getAssistants}
        />
      )}
    </>
  );
}


export default AdminAssistants;