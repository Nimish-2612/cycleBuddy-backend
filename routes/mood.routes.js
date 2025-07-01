const express = require('express');
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const { sendMoodUpdate, getLatestMood } = require("../controllers/mood.controller");

router.post("/update", authMiddleware, sendMoodUpdate); //sent from GF Dashboard
router.get("/latest",getLatestMood); //Recieved at BF Dashboard

module.exports = router;