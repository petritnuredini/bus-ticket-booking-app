import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function PaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

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

    console.log("Payment method:", paymentMethod);
    setLoading(false);
    onSuccess(paymentMethod.id);
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
