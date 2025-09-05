import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../helpers/axiosInstance";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { Row, Col, message, Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import moment from "moment";
import SeatSelection from "../components/SeatSelection";
import TicketDownload from "../components/TicketDownload";

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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);

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

  const bookNow = async (paymentData) => {
    try {
      dispatch(ShowLoading());
      const response = await axiosInstance.post(
        `/api/bookings/book-seat/${localStorage.getItem("user_id")}`,
        {
          bus: bus._id,
          seats: selectedSeats,
          transactionId: paymentData.paymentMethodId,
          paymentDetails: {
            email: paymentData.email,
            cardholderName: paymentData.cardholderName,
            cardDetails: paymentData.cardDetails
          }
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        // Show ticket download modal instead of navigating away
        setBookingId(response.data.data._id);
        setShowTicketModal(true);
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
        <title>Book Now - {bus?.name || 'Bus Booking'}</title>
      </Helmet>
      
      <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {bus && (
            <div>
              {/* Modern Blue Title */}
              <h1 style={{ 
                fontSize: '36px', 
                textAlign: 'center', 
                marginBottom: '30px', 
                color: '#1e40af',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                Book Bus Ticket
              </h1>

              {/* Modern Bus Info Card */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '25px', 
                marginBottom: '30px',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '20px', 
                  color: '#1e40af',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  {bus.name}
                </h2>
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>From:</span>
                    <span style={{ fontSize: '18px', color: '#1f2937' }}>{bus.from}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>To:</span>
                    <span style={{ fontSize: '18px', color: '#1f2937' }}>{bus.to}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>Date:</span>
                    <span style={{ fontSize: '18px', color: '#1f2937' }}>{bus.journeyDate}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>Departure:</span>
                    <span style={{ fontSize: '18px', color: '#1f2937' }}>{moment(bus.departure, "HH:mm").format("hh:mm A")}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px',
                    border: '1px solid #dbeafe'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>Arrival:</span>
                    <span style={{ fontSize: '18px', color: '#1f2937' }}>{moment(bus.arrival, "HH:mm").format("hh:mm A")}</span>
                  </div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#dbeafe',
                    borderRadius: '6px',
                    border: '1px solid #3b82f6',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af' }}>
                      Price: {bus.price} € per seat
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Seat Selection */}
              <div style={{ 
                backgroundColor: 'white',
                padding: '25px',
                marginBottom: '30px',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ 
                  fontSize: '28px', 
                  marginBottom: '20px', 
                  color: '#1e40af',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Choose Your Seats
                </h2>
                <SeatSelection
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  bus={bus}
                />
              </div>

              {/* Modern Booking Summary */}
              {selectedSeats.length > 0 && (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '25px', 
                  marginBottom: '30px',
                  border: '2px solid #10b981',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ 
                    fontSize: '28px', 
                    marginBottom: '20px', 
                    color: '#1e40af',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Your Booking
                  </h2>
                  <div style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ 
                      padding: '15px', 
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <p style={{ fontSize: '18px', margin: '0', color: '#1f2937' }}>
                        <strong style={{ color: '#1e40af' }}>Selected Seats:</strong> {selectedSeats.join(', ')}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '15px', 
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <p style={{ fontSize: '18px', margin: '0', color: '#1f2937' }}>
                        <strong style={{ color: '#1e40af' }}>Number of Seats:</strong> {selectedSeats.length}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: '#dbeafe',
                      borderRadius: '6px',
                      border: '1px solid #3b82f6',
                      textAlign: 'center'
                    }}>
                      <p style={{ fontSize: '20px', margin: '0', color: '#1e40af', fontWeight: 'bold' }}>
                        Total Price: {bus.price * selectedSeats.length} €
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Modern Payment */}
              {selectedSeats.length > 0 ? (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '25px',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <h2 style={{ 
                    fontSize: '28px', 
                    marginBottom: '20px', 
                    color: '#1e40af',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Payment
                  </h2>
                  <Elements stripe={stripePromise} key="payment-elements">
                    <PaymentForm
                      amount={bus.price * selectedSeats.length}
                      onSuccess={(paymentData) => {
                        bookNow(paymentData);
                      }}
                    />
                  </Elements>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '25px',
                  border: '2px solid #6b7280',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '20px', color: '#6b7280', margin: '0' }}>
                    Please select seats first to continue with payment
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ticket Download Modal */}
      <Modal
        title="🎫 Your Ticket is Ready!"
        open={showTicketModal}
        onCancel={() => {
          setShowTicketModal(false);
          navigate("/bookings");
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '900px' }}
        centered
      >
        {bookingId && (
          <TicketDownload 
            bookingId={bookingId}
            onClose={() => {
              setShowTicketModal(false);
              navigate("/bookings");
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default BookNow;
