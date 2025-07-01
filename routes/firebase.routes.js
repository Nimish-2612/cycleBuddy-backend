const express = require('express');
const { makeFirebaseNotification, saveFCMToken } = require('../controllers/firebase.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/send-notification',makeFirebaseNotification)
router.post('/save-token',authMiddleware,saveFCMToken)
module.exports = router;