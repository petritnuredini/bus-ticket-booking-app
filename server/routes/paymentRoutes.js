const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

// Merr secret key nga .env
const stripe = Stripe(process.env.stripe_key);

// API: bëj pagesë
router.post("/make-payment", async (req, res) => {
  try {
    const { amount, email, cardholderName, cardDetails } = req.body;

    if (!amount) {
      return res.status(400).send({
        success: false,
        message: "Amount is required",
      });
    }

    // Krijo PaymentIntent pa payment method (do të përdoret për test)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe punon me cent (10€ = 1000)
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Për test, supozojmë se pagesa u konfirmua
    // Në prodhim, duhet të konfirmosh PaymentIntent-in
    res.send({
      success: true,
      message: "Payment successful",
      data: {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: "succeeded", // Për test
        paymentMethod: {
          id: `pm_test_${Date.now()}`,
          email: email || 'test@example.com',
          cardholderName: cardholderName || 'Test User',
          cardDetails: cardDetails || {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        }
      },
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
