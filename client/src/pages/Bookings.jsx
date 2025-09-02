import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { message, Table, Modal } from "antd";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import PageTitle from "../components/PageTitle";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Helmet } from "react-helmet";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const getBookings = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`,
        {}
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

  const CancelBooking = async () => {
    try {
      dispatch(ShowLoading());
      const res = await axiosInstance.get(
        `/api/bookings/${localStorage.getItem("user_id")}`
      );
      const bus_id = res.data.data[0].bus._id;
      const user_id = res.data.data[0].user._id;
      const booking_id = res.data.data[0]._id;
      const response = await axiosInstance.delete(
        `/api/bookings/${booking_id}/${user_id}/${bus_id}`,
        {}
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        getBookings();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
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
      render: (text, record) => <span>{record.amountPaid} €</span>, // ✅ tash vjen nga backend
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex gap-2">
          <button
            className="underline text-base text-green-500 cursor-pointer hover:text-green-700"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            View
          </button>
          <button
            className="underline text-base text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => {
              CancelBooking();
            }}
          >
            Cancel
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
      <Helmet>
        <title>Bookings</title>
      </Helmet>

      <div className="p-5">
        <PageTitle title="Bookings" />
        <Table columns={columns} dataSource={bookings} />

        <div
          className="flex flex-col items-center justify-center bg-center bg-cover"
          ref={componentRef}
        >
          <div className="absolute bg-white opacity-80 inset-0 z-0"></div>
          <div className="max-w-md w-full h-full mx-auto z-10 bg-blue-900 rounded-3xl">
            <div className="flex flex-col">
              <div className="bg-white relative drop-shadow-2xl  rounded-3xl p-4 m-4">
                <div className="flex-none sm:flex">
                  <div className="flex-auto justify-evenly">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center my-1">
                        <h2 className="font-medium">
                          {selectedBooking?.name}
                        </h2>
                      </div>
                      <div className="ml-auto font-bold text-blue-600">
                        {selectedBooking?.user}
                      </div>
                    </div>
                    <div className="border-dashed border-b-2 my-5"></div>
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="w-full flex-none text-lg text-blue-800 font-bold leading-none">
                          From
                        </div>
                        <div className="text-xs">{selectedBooking?.from}</div>
                      </div>
                      <div className="flex flex-col ">
                        <div className="w-full flex-none text-lg text-blue-800 font-bold leading-none">
                          To
                        </div>
                        <div className="text-xs">{selectedBooking?.to}</div>
                      </div>
                    </div>
                    <div className="border-dashed border-b-2 my-5 pt-5"></div>

                    <div className="flex items-center mb-4 px-5">
                      <div className="flex flex-col text-sm">
                        <span className="">Depart Time</span>
                        <div className="font-semibold">
                          {moment(
                            selectedBooking?.departure,
                            "HH:mm"
                          ).format("hh:mm A")}
                        </div>
                      </div>
                      <div className="flex flex-col text-sm ml-auto">
                        <span className="">Arrival Time</span>
                        <div className="font-semibold">
                          {moment(selectedBooking?.arrival, "HH:mm").format(
                            "hh:mm A"
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-dashed border-b-2 my-5 pt-5"></div>

                    <div className="flex items-center px-5 pt-3 text-sm">
                      <div className="flex flex-col">
                        <span className="">Price</span>
                        <div className="font-semibold">
                          {selectedBooking?.amountPaid} € {/* ✅ përdor amountPaid */}
                        </div>
                      </div>

                      <div className="flex flex-col ml-auto">
                        <span className="">Seats</span>
                        <div className="font-semibold">
                          {selectedBooking?.seats.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col py-5  justify-center text-sm ">
                      <div className="barcode h-14 w-0 inline-block mt-4 relative left-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Bookings;
