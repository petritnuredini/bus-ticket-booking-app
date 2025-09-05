const Ticket = require('../models/ticketModel');
const Booking = require('../models/bookingsModel');
const Bus = require('../models/busModel');
const User = require('../models/usersModel');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a digital ticket for a booking
 */
const generateTicket = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Check if ticket already exists
    const existingTicket = await Ticket.findOne({ bookingId });
    if (existingTicket) {
      return res.json({
        success: true,
        data: existingTicket,
        message: 'Ticket already exists'
      });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('bus')
      .populate('user');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Generate unique ticket number
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create QR code data
    const qrData = {
      ticketNumber,
      bookingId: booking._id,
      passengerName: booking.user.name,
      busFrom: booking.bus.from,
      busTo: booking.bus.to,
      departureTime: booking.bus.departureTime,
      seatNumbers: booking.seats,
      amount: booking.amountPaid,
      timestamp: new Date().toISOString()
    };

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData));

    // Create ticket
    const ticket = new Ticket({
      bookingId: booking._id,
      ticketNumber,
      qrCodeData,
      passengerName: booking.user.name,
      passengerEmail: booking.user.email,
      busDetails: {
        from: booking.bus.from,
        to: booking.bus.to,
        departureTime: booking.bus.departureTime,
        arrivalTime: booking.bus.arrivalTime,
        busNumber: booking.bus.busNumber,
        busType: booking.bus.busType
      },
      seatNumbers: booking.seats,
      totalAmount: booking.amountPaid,
      bookingDate: booking.createdAt
    });

    await ticket.save();

    res.json({
      success: true,
      data: ticket,
      message: 'Ticket generated successfully'
    });

  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating ticket',
      error: error.message
    });
  }
};

/**
 * Get ticket details by ticket number or booking ID
 */
const getTicket = async (req, res) => {
  try {
    const { ticketNumber, bookingId } = req.query;

    let ticket;
    if (ticketNumber) {
      ticket = await Ticket.findOne({ ticketNumber });
    } else if (bookingId) {
      ticket = await Ticket.findOne({ bookingId });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Ticket number or booking ID required'
      });
    }

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting ticket',
      error: error.message
    });
  }
};

/**
 * Validate ticket by scanning QR code
 */
const validateTicket = async (req, res) => {
  try {
    const { qrCodeData, validatedBy } = req.body;

    // Parse QR code data
    const ticketData = JSON.parse(qrCodeData);
    const { ticketNumber, bookingId } = ticketData;

    // Find ticket
    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket'
      });
    }

    // Check if ticket is already used
    if (ticket.status === 'used') {
      return res.json({
        success: false,
        message: 'Ticket already used',
        data: {
          ticketNumber: ticket.ticketNumber,
          usedAt: ticket.validatedAt,
          usedBy: ticket.validatedBy
        }
      });
    }

    // Check if ticket is expired (departure time passed)
    const now = new Date();
    if (ticket.busDetails.departureTime < now) {
      ticket.status = 'expired';
      await ticket.save();
      return res.json({
        success: false,
        message: 'Ticket expired',
        data: {
          ticketNumber: ticket.ticketNumber,
          departureTime: ticket.busDetails.departureTime
        }
      });
    }

    // Validate ticket
    ticket.status = 'used';
    ticket.isValidated = true;
    ticket.validatedAt = new Date();
    ticket.validatedBy = validatedBy || 'System';
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket validated successfully',
      data: {
        ticketNumber: ticket.ticketNumber,
        passengerName: ticket.passengerName,
        busDetails: ticket.busDetails,
        seatNumbers: ticket.seatNumbers,
        validatedAt: ticket.validatedAt,
        validatedBy: ticket.validatedBy
      }
    });

  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating ticket',
      error: error.message
    });
  }
};

/**
 * Get all tickets for a user
 */
const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await Ticket.find({
      'passengerEmail': { $in: await User.findById(userId).select('email') }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: tickets
    });

  } catch (error) {
    console.error('Error getting user tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user tickets',
      error: error.message
    });
  }
};

module.exports = {
  generateTicket,
  getTicket,
  validateTicket,
  getUserTickets
};
