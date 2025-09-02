import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    // 1. Krijo PaymentMethod nga Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
      billing_details: { email },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    try {
      // 2. Thirr backend për të bërë pagesën
      const response = await fetch("http://localhost:3001/api/payments/make-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount, // vjen nga BookNow.js (bus.price * selectedSeats.length)
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Payment successful 🎉");
        onSuccess(paymentMethod.id);
      } else {
        alert("Payment failed: " + data.message);
      }
    } catch (err) {
      alert("Error: " + err.message);
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
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
