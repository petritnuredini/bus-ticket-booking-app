const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Merr secret key nga .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// API: bëj pagesë
router.post("/make-payment", async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    if (!amount || !paymentMethodId) {
      return res.status(400).send({
        success: false,
        message: "Amount and paymentMethodId are required",
      });
    }

    // Krijo pagesën (PaymentIntent)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe punon me cent (10€ = 1000)
      currency: "eur",
      payment_method: paymentMethodId,
      confirm: true,
    });

    res.send({
      success: true,
      message: "Payment successful",
      data: paymentIntent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
