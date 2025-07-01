const admin = require("firebase-admin");
const { getDb } = require("../config/data");
let userTokens = {}; // in-memory storage (optional in your case)

const saveFCMToken = async (req, res) => {
  const user = req.user;
  const token = req.body.token;

  if (!user || !token) {
    return res.status(400).json({ message: "Missing user or token" });
  }

  try {
    const db = getDb();
    const result = await db.collection("users").updateOne(
      { name:"Nimish" }, // using user ID from JWT
      { $set: { fcmToken: token } },
    );

    console.log(
      `[FCM] Updated token for user ${user.name || user.id}: ${token}`
    );
    return res
      .status(200)
      .json({ message: "Token updated in database", result });
  } catch (err) {
    console.error("Error saving FCM token to DB:", err);
    return res.status(500).json({ error: "Failed to update token in DB" });
  }
};

const makeFirebaseNotification = async (req, res) => {
  const registrationToken = FCM_TOKEN;
  if (
    !registrationToken ||
    registrationToken === "YOUR_HARDCODED_FCM_REGISTRATION_TOKEN_HERE"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "FCM Registration Token is missing or placeholder. Please update server.js with a valid token.",
    });
  }

  const message = {
    notification: {
      title: req.body.title || "Test Notification from Backend",
      body:
        req.body.body ||
        "This is a test message sent from your Node.js Express server!",
      imageUrl:
        req.body.imageUrl ||
        "https://placehold.co/128x128/FF0000/FFFFFF?text=FCM", // Optional: a URL for a notification icon/image
    },
    data: {
      customData: req.body.customData || "some_value",
      timestamp: new Date().toISOString(),
      source: "backend-server",
    },
    token: registrationToken,
  };

  try {
    // Send the message using the Firebase Admin SDK
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    res.status(200).json({
      success: true,
      message: "Notification sent successfully!",
      messageId: response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    // Handle specific Firebase errors if needed (e.g., token expired, invalid token)
    res.status(500).json({
      success: false,
      message: "Error sending notification",
      error: error.message,
    });
  }
};

module.exports = { makeFirebaseNotification, saveFCMToken, userTokens };
