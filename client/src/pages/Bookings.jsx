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
import { useTranslation } from "react-i18next";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Merr bookings nga API
  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/bookings/${localStorage.getItem("user_id")}`
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
  //       `/bookings/${record._id}/${record.userId}/${record.busId}`
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

  // Table columns
  const columns = [
    {
      title: t('admin.busName'),
      dataIndex: "name",
      key: "bus",
    },
    {
      title: t('admin.fullName'),
      dataIndex: "user",
      key: "user",
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
    {
      title: t('admin.price'),
      key: "price",
      render: (text, record) => <span>{record.amountPaid} €</span>,
    },
    {
      title: t('admin.actions'),
      key: "actions",
      render: (text, record) => (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadTicket(record._id)}
          size="small"
        >
          {t('booking.downloadTicket')}
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
        <title>{t('common.bookings')}</title>
      </Helmet>

      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <PageTitle title={t('common.bookings')} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/international-booking")}
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
            size="large"
          >
            {t('booking.addNewBooking')}
          </Button>
        </div>
        <Table columns={columns} dataSource={bookings} />
      </div>

      {/* Ticket Download Modal */}
      <Modal
        title={`🎫 ${t('booking.downloadYourTicket')}`}
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
