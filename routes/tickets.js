const express = require("express");
const router = express.Router();
const Tickets = require("../models/Tickets");

router.post("/save", async (req, res) => {
  const { userId, trackName, date, ticketName, amount, baseWager, startRace, legs } = req.body;
  const ticket = new Tickets({ userId, trackName, date, ticketName, amount, baseWager, startRace, legs });
  await ticket.save();
  res.json({ success: true });
});

router.get("/:userId/:trackName/:date", async (req, res) => {
  const { userId, trackName, date } = req.params;
  const tickets = await Tickets.find({ userId, trackName, date });
  res.json(tickets || []);
});

module.exports = router;
