const mongoose = require('mongoose');

/**
 * Ticket Schema - Represents a digital ticket for bus bookings
 * Contains all ticket information including QR code data for validation
 */
const ticketSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // Each booking has one ticket
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true // Unique ticket number for identification
  },
  qrCodeData: {
    type: String,
    required: true // QR code data for scanning
  },
  passengerName: {
    type: String,
    required: true
  },
  passengerEmail: {
    type: String,
    required: true
  },
  busDetails: {
    from: String,
    to: String,
    departureTime: Date,
    arrivalTime: Date,
    busNumber: String,
    busType: String
  },
  seatNumbers: [{
    type: String,
    required: true
  }],
  totalAmount: {
    type: Number,
    required: true
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
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'used', 'cancelled', 'expired'],
    default: 'active'
  },
  isValidated: {
    type: Boolean,
    default: false
  },
  validatedAt: {
    type: Date
  },
  validatedBy: {
    type: String // Who validated the ticket (admin/operator)
  }
}, {
  timestamps: true
});

// Index for fast ticket lookups
ticketSchema.index({ ticketNumber: 1 });
ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ qrCodeData: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
