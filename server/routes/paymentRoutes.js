const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Merr secret key nga .env
const stripe = Stripe(process.env.stripe_key);

// API: bëj pagesë
router.post("/make-payment", async (req, res) => {
  try {
    const { amount, paymentMethodId, email, cardholderName, cardDetails } = req.body;

    if (!amount || !paymentMethodId) {
      return res.status(400).send({
        success: false,
        message: "Amount and paymentMethodId are required",
      });
    }

    // Krijo PaymentIntent me payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe punon me cent (10€ = 1000)
      currency: "eur",
      payment_method: paymentMethodId,
      confirm: true,
      return_url: "http://localhost:3000", // Return URL për redirect
    });

    // Kontrollo nëse pagesa u konfirmua
    if (paymentIntent.status === 'succeeded') {
      res.send({
        success: true,
        message: "Payment successful",
        data: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
          paymentMethod: {
            id: paymentMethodId,
            email,
            cardholderName,
            cardDetails
          }
        },
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment not completed",
        data: paymentIntent,
      });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
