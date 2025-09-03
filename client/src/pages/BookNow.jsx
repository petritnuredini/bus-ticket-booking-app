import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";
import SeatSelection from "../components/SeatSelection";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "../components/PaymentForm";

  const stripePromise = loadStripe("pk_test_51S1mfrFtZNvMqulyW4bLUF6gK3iwS3QVaOFpwcmf3VMI2TYi9CeGrVGqDLlsdMAeEGQB2RKU4jY3YF1FTNNcaGd200URefkIX3"); // public key

function BookNow() {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const [bus, setBus] = useState(null);

  const getBus = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.get(`/api/buses/${params.id}`);
      dispatch(HideLoading());
      if (response.data.success) {
        setBus(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch, params.id]);

  const bookNow = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId,
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        navigate("/bookings");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBus();
  }, [getBus]);

  return (
    <>
      <Helmet>
        <title>Book Now</title>
      </Helmet>
      <div>
        {bus && (
          <Row className="m-3 p-5" gutter={[30, 30]}>
            <Col lg={12} xs={24} sm={24}>
              <h1 className="font-extrabold text-2xl text-blue-500">
                {bus.name}
              </h1>
              <h1 className="text-2xl font-bold">
                {bus.from} - {bus.to}
              </h1>
              <hr className="border-black" />

              <div className="flex flex-col gap-1">
                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Journey Date : </b>
                  <span>{bus.journeyDate}</span>
                </h1>

                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Price :</b>{" "}
                  {bus.price} € /-
                </h1>

                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Departure Time :</b>{" "}
                  {moment(bus.departure, "HH:mm").format("hh:mm A")}
                </h1>

                <h1 className="text-lg">
                  <b className="text-blue-600 italic">Arrival Time :</b>{" "}
                  {moment(bus.arrival, "HH:mm").format("hh:mm A")}
                </h1>
              </div>

              <hr className="border-black" />

              {/* Capacity & Seats Left */}
              <Row gutter={[16, 16]} className="mt-2">
                <Col span={12}>
                  <h1 className="text-lg font-bold">
                    <span className="text-blue-600 italic">Capacity :</span>{" "}
                    {bus.capacity}
                  </h1>
                </Col>
                <Col span={12}>
                  <h1 className="text-lg font-bold">
                    <span className="text-blue-600 italic">Seats Left :</span>{" "}
                    {bus.capacity -
                      bus.seatsBooked.length -
                      selectedSeats.length}
                  </h1>
                </Col>
              </Row>

              <hr className="border-black" />

              {/* Selected Seats & Price */}
              <div className="mt-3">
                <h1 className="text-xl">
                  <b className="text-blue-600 italic">Selected Seats :</b>{" "}
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "None"}
                </h1>

                <h1 className="text-xl mt-2 mb-3">
                  <b className="text-blue-600 italic">Price :</b>{" "}
                  {bus.price * selectedSeats.length} €
                </h1>

                {/* Payment Form */}
                {selectedSeats.length > 0 ? (
                  <Elements stripe={stripePromise}>
                    <PaymentForm
                      amount={bus.price * selectedSeats.length}
                      onSuccess={(paymentId) => {
                        bookNow(paymentId);
                      }}
                    />
                  </Elements>
                ) : (
                  <button
                    disabled
                    className="cursor-not-allowed py-3 px-5 rounded-full bg-gray-400 text-white font-bold"
                  >
                    Select seats first
                  </button>
                )}
              </div>
            </Col>

            <Col lg={12} xs={24} sm={24}>
              <SeatSelection
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                bus={bus}
              />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default BookNow;
