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
          name: cardholderName
        },
      });

      if (error) {
        console.log(error.message);
        setLoading(false);
        return;
      }

      // 2. Thirr backend për të bërë pagesën
      const response = await fetch("http://localhost:3001/api/payments/make-payment", {
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
            exp_year: paymentMethod.card.exp_year
          }
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
            exp_year: paymentMethod.card.exp_year
          }
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-5 border rounded-xl shadow-lg bg-white"
      style={{ maxWidth: 400 }}
    >
      {/* Email Field */}
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Cardholder Name Field */}
      <input
        type="text"
        placeholder="Cardholder Name"
        value={cardholderName}
        onChange={(e) => setCardholderName(e.target.value)}
        required
        className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Card Field */}
      <div className="border px-3 py-2 rounded-lg">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default PaymentForm;
