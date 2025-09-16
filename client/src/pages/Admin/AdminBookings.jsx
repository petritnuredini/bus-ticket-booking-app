import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../../helpers/axiosInstance";
import { message, Table } from "antd";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import PageTitle from "../../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/bookings/get-all-bookings`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
          };
        });
        setBookings(mappedData);
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
      title: t('admin.busName'),
      dataIndex: "name",
      key: "bus",
    },
    {
      title: t('admin.fullName'),
      dataIndex: "user",
      render: (user) => `${user.name}`,
    },

    {
      title: t('booking.busNumber'),
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: t('booking.journeyDate'),
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
    },
    {
      title: t('admin.journeyTime'),
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
    },
    {
      title: t('booking.seats'),
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <>
      <Helmet>
        <title>{t('admin.bookings')}</title>
      </Helmet>
      <div className="p-5">
        <PageTitle title={t('admin.bookings')} />
        <Table columns={columns} dataSource={bookings} />
      </div>
    </>
  );
}

export default AdminBookings;
