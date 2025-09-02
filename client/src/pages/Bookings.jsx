import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      dispatch(HideLoading());
      if (response.data.success) {
        const mappedData = response.data.data.map((booking) => {
          return {
            ...booking,
            ...booking.bus,
            key: booking._id,
            user: booking.user.name,
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

  const CancelBooking = async (record) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.delete(
        `/api/bookings/${record._id}/${record.user._id}/${record.bus._id}`
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success("Rezervimi u anulua me sukses!");
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const confirmCancel = (record) => {
    Modal.confirm({
      title: "A jeni i sigurt që doni të anuloni këtë rezervim?",
      content: `Autobusi: ${record.name} | Ulëset: ${record.seats.join(", ")}`,
      okText: "Po, anulo",
      okType: "danger",
      cancelText: "Jo",
      onOk: () => CancelBooking(record),
    });
  };

  const columns = [
    {
      title: "Bus Name",
      dataIndex: "name",
      key: "bus",
    },
    {
      title: "Full Name",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Bus Number",
      dataIndex: "busNumber",
      key: "bus",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
      render: (journeyDate) => moment(journeyDate).format("DD/MM/YYYY"),
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
      render: (departure) => moment(departure, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => seats.join(", "),
    },
    {
      title: "Price",
      key: "price",
      render: (text, record) => <span>{record.amountPaid} €</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <button
          className="underline text-base text-red-500 cursor-pointer hover:text-red-700"
          onClick={() => confirmCancel(record)}
        >
          Cancel
        </button>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />
      </div>
    </>
  );
}

export default Bookings;
