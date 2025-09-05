const express = require('express');
const router = express.Router();
const {
  generateTicket,
  getTicket,
  validateTicket,
  getUserTickets
} = require('../Controllers/ticketController');
const auth = require('../middlewares/authMiddleware');

router.post('/generate', auth, generateTicket);

router.get('/get', getTicket);

router.post('/validate', validateTicket);

router.get('/user/:userId', auth, getUserTickets);

module.exports = router;
