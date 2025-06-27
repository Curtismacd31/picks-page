const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  trackName: String,
  date: String,
  ticketName: String,
  amount: Number,
  baseWager: Number,
  startRace: Number,
  legs: [{ legNo: Number, selections: String }]
});

module.exports = mongoose.model("Tickets", ticketSchema);
