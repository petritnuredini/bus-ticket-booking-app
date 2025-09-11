import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal, Button } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { Helmet } from "react-helmet";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import TicketDownload from "../components/TicketDownload";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Merr bookings nga API
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
            user: booking.user.name, // shfaq emrin
          //  userId: booking.user._id,  ruaj id për Cancel
           // busId: booking.bus._id,  ruaj id për Cancel
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

  // Anulo booking
  // const CancelBooking = async (record) => {
  //   try {
  //     dispatch(ShowLoading());
  //     const response = await axiosInstance.delete(
  //       `/api/bookings/${record._id}/${record.userId}/${record.busId}`
  //     );
  //     dispatch(HideLoading());

  //     if (response.data.success) {
  //       message.success("Rezervimi u anulua me sukses!");
  //       getBookings();
  //     } else {
  //       message.error(response.data.message);
  //     }
  //   } catch (error) {
  //     dispatch(HideLoading());
  //     message.error(error.message);
  //   }
  // };

  // // Konfirmim para anulimit
  // const confirmCancel = (record) => {
  //   Modal.confirm({
  //     title: "A jeni i sigurt që doni të anuloni këtë rezervim?",
  //     content: `Autobusi: ${record.name} | Ulëset: ${record.seats.join(", ")}`,
  //     okText: "Po, anulo",
  //     okType: "danger",
  //     cancelText: "Jo",
  //     onOk: () => CancelBooking(record),
  //   });
  // };

  // Handle ticket download
  const handleDownloadTicket = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowTicketModal(true);
  };

  // Kolonat e tabelës
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
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadTicket(record._id)}
          size="small"
        >
          Download Ticket
        </Button>
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
        <div className="flex justify-between items-center mb-4">
          <PageTitle title="Bookings" />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/international-booking")}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            size="large"
          >
            Add New Booking
          </Button>
        </div>
        <Table columns={columns} dataSource={bookings} />
      </div>

      {/* Ticket Download Modal */}
      <Modal
        title="🎫 Download Your Ticket"
        open={showTicketModal}
        onCancel={() => {
          setShowTicketModal(false);
          setSelectedBookingId(null);
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '900px' }}
        centered
      >
        {selectedBookingId && (
          <TicketDownload 
            bookingId={selectedBookingId}
            onClose={() => {
              setShowTicketModal(false);
              setSelectedBookingId(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default Bookings;
