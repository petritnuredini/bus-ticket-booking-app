const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buses",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    seats: {
      type: Array,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    amountPaid: {               // ✅ fusha e re për çmimin total
      type: Number,
      required: true,
    },
    paymentDetails: {
      email: {
        type: String,
        required: true
      },
      cardholderName: {
        type: String,
        required: true
      },
      cardDetails: {
        brand: String,
        last4: String,
        exp_month: Number,
        exp_year: Number
      }
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("bookings", bookingSchema);
