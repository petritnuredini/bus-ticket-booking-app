import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Krijo PaymentMethod nga Stripe (për të marrë detajet e kartës)
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          email,
          name: cardholderName,
        },
      });

      if (error) {
        console.log(error.message);
        setLoading(false);
        return;
      }

      // 2. Thirr backend për të bërë pagesën
      const apiUrl =
        process.env.REACT_APP_API_URL || "http://localhost:3001/api";
      const response = await fetch(`${apiUrl}/payments/make-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount, // vjen nga BookNow.js (bus.price * selectedSeats.length)
          email,
          cardholderName,
          cardDetails: {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Payment successful 🎉");
        onSuccess({
          paymentMethodId: data.data.paymentMethod.id,
          email,
          cardholderName,
          cardDetails: {
            brand: paymentMethod.card.brand,
            last4: paymentMethod.card.last4,
            exp_month: paymentMethod.card.exp_month,
            exp_year: paymentMethod.card.exp_year,
          },
        });
      } else {
        alert("Payment failed: " + data.message);
      }
    } catch (err) {
      console.log("Error: " + err.message);
      alert("Payment failed: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1e40af",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #dbeafe",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              color: "#1f2937",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.backgroundColor = "white";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dbeafe";
              e.target.style.backgroundColor = "#f8fafc";
            }}
          />
        </div>

        {/* Cardholder Name Field */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1e40af",
            }}
          >
            Cardholder Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "16px",
              border: "2px solid #dbeafe",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              color: "#1f2937",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3b82f6";
              e.target.style.backgroundColor = "white";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dbeafe";
              e.target.style.backgroundColor = "#f8fafc";
            }}
          />
        </div>

        {/* Card Field */}
        <div style={{ marginBottom: "25px" }}>
          <label
            style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "8px",
              color: "#1e40af",
            }}
          >
            Card Details
          </label>
          <div
            style={{
              padding: "12px",
              border: "2px solid #dbeafe",
              borderRadius: "8px",
              backgroundColor: "#f8fafc",
              transition: "all 0.2s ease",
            }}
          >
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#1f2937",
                    fontFamily: "system-ui, sans-serif",
                  },
                  invalid: {
                    color: "#ef4444",
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
        </div>

        {/* Modern Blue Pay Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 2px 4px rgba(59, 130, 246, 0.3)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#1e40af";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 12px rgba(59, 130, 246, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = "#3b82f6";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 8px rgba(59, 130, 246, 0.3)";
            }
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Processing...
            </div>
          ) : (
            `Pay ${amount} €`
          )}
        </button>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default PaymentForm;
