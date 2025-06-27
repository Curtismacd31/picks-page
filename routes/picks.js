const express = require("express");
const router = express.Router();
const Picks = require("../models/Picks");

router.post("/save", async (req, res) => {
  const { userId, trackName, date, races } = req.body;
  const existing = await Picks.findOne({ userId, trackName, date });
  if (existing) {
    existing.races = races;
    await existing.save();
  } else {
    await Picks.create({ userId, trackName, date, races });
  }
  res.json({ success: true });
});

router.get("/:userId/:trackName/:date", async (req, res) => {
  const { userId, trackName, date } = req.params;
  const picks = await Picks.findOne({ userId, trackName, date });
  res.json(picks || {});
});

module.exports = router;
