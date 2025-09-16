import React, { useCallback, useState } from "react";
import PageTitle from "../../components/PageTitle";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function AdminUsers() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  const getUsers = useCallback( async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get("/users/get-all-users", {});
      dispatch(HideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const columns = [
    {
      title: t('auth.name'),
      dataIndex: "name",
    },
    {
      title: t('auth.email'),
      dataIndex: "email",
    },
    {
      title: t('admin.accountCreatedAt'),
      dataIndex: "createdAt",
      render: (text, record) => {
        return new Date(record.createdAt).toLocaleDateString();
      },
    },
  ];

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <>
      <Helmet>
        <title>{t('admin.users')}</title>
      </Helmet>
      <div>
        <div className="flex justify-between p-7">
          <PageTitle title={t('admin.users')} />
        </div>
        <div className="p-7">
          <Table
            columns={columns}
            dataSource={users}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </>
  );
}

export default AdminUsers;
