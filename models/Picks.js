const mongoose = require("mongoose");

const picksSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  trackName: String,
  date: String,
  races: [{ raceNo: Number, picks: String }]
});

module.exports = mongoose.model("Picks", picksSchema);
