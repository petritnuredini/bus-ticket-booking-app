import React, { useCallback, useEffect, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { message, Table } from "antd";
import DepartmentForm from "../../components/DepartmentForm";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import{Popconfirm} from "antd";

function AdminDepartments() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [departments, setDepartments] = useState([]);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const getDepartments = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/departments");
      dispatch(HideLoading());

      if (response.data.success) setDepartments(response.data.data);
      else message.error(response.data.message);
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);
const deleteDepartment = async (record) => {
  try {
    dispatch(ShowLoading());

    const response = await axiosInstance.delete(
      `/departments/${record._id}`
    );

    dispatch(HideLoading());

    if (response.data.success) {
      message.success(
        response.data.message || t("admin.deleted", "Deleted successfully")
      );
      getDepartments();
    } else {
      message.error(response.data.message);
    }
  } catch (error) {
    dispatch(HideLoading());
    message.error(error.message);
  }
};
  const columns = [
    { title: "Emri Departamentit", dataIndex: "emriDepartamentit" },
    { title: "Numri Zyrave", dataIndex: "numriZyrave" },
    {
      title: t("admin.action", "Action"),
      render: (_, record) => (
        <span
          className="underline cursor-pointer"
          onClick={() => {
            setSelectedDepartment(record);
            setShowDepartmentForm(true);
          }}
        >
          Edit
        </span>
      ),
    },
    {
  title: t("admin.actions", "Actions"),
  render: (text, record) => (
    <div className="flex gap-3">
      <Popconfirm
        title={t("admin.confirmDeleteTitle", "A je e sigurt?")}
        description={t(
          "admin.confirmDeleteDesc",
          "Kjo do ta fshijë departamentin."
        )}
        okText={t("admin.yes", "Po")}
        cancelText={t("admin.no", "Jo")}
        onConfirm={() => deleteDepartment(record)}
      >
        <span className="underline cursor-pointer text-red-600">
          {t("admin.delete", "Delete")}
        </span>
      </Popconfirm>
    </div>
  ),
}
  ];
    
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  return (
    <>
      <Helmet><title>Admin - Departments</title></Helmet>

      <div className="flex items-center justify-between">
        <PageTitle title={t("admin.departments", "Departments")} />
        <button
          className="primary-contained-btn"
          onClick={() => {
            setSelectedDepartment(null);
            setShowDepartmentForm(true);
          }}
        >
          Add Department
        </button>
      </div>

      <Table rowKey="_id" columns={columns} dataSource={departments} />

      {showDepartmentForm && (
        <DepartmentForm
          showDepartmentForm={showDepartmentForm}
          setShowDepartmentForm={setShowDepartmentForm}
          type={selectedDepartment ? "edit" : "add"}
          getData={getDepartments}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
        />
      )}
    </>
  );
}

export default AdminDepartments;