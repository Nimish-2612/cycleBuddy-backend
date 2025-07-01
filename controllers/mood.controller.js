const { getDb } = require("../config/data");
const admin = require("firebase-admin");
// controllers/moodController.js
let lastSentMoodId = null; // In-memory tracker (for demo)


async function sendMoodUpdate(req, res) {
  const { mood } = req.body;
  const db = getDb();

  const senderId = req.user.id;
  const senderName = req.user.name || "Unknown";

  try {
    // Save mood to DB
    await db.collection("moods").insertOne({
      mood,
      senderId,
      senderName,
      timeStamp: new Date(),
    });

    return res.status(200).json({
      message: "Mood saved successfully. No notification triggered.",
    });
  } catch (err) {
    console.error("Error in sendMoodUpdate:", err);
    return res
      .status(500)
      .json({ error: "Failed to save mood" });
  }
}


async function getLatestMood(req, res) {
  const db = getDb();

  try {
    const latestMood = await db
      .collection("moods")
      .find()
      .sort({ timeStamp: -1 })
      .limit(5)
      .toArray();

    const lastMoodEntry = latestMood[0];
    const senderName = lastMoodEntry?.senderName || "Your partner";
    const mood = lastMoodEntry?.mood || "Unknown mood";

    // Only send notification if this mood is new
    const currentMoodId = lastMoodEntry?._id?.toString();

    if (currentMoodId && currentMoodId !== lastSentMoodId) {
      lastSentMoodId = currentMoodId; // update tracker

      const boyfriend = await db.collection("users").findOne({ name: "Nimish" });

      if (boyfriend?.fcmToken) {
        const message = {
          notification: {
            title: "Mood Check 💬",
            body: `${senderName}'s latest mood is: ${mood}`,
          },
          data: {
            mood,
            senderName,
            timestamp: new Date().toISOString(),
          },
          token: boyfriend.fcmToken,
        };

        try {
          const fcmResponse = await admin.messaging().send(message);
          console.log("[✅ Notification sent]", fcmResponse);
        } catch (err) {
          console.error("[❌ Notification error]", err.message);
        }
      } else {
        console.log("[ℹ️] No FCM token found.");
      }
    } else {
      console.log("[ℹ️] No new mood. Skipping notification.");
    }

    return res.status(200).json({ mood: latestMood });
  } catch (err) {
    console.error("Error in getLatestMood:", err);
    res.status(500).json({ error: "Failed to get mood" });
  }
}


module.exports = {
  sendMoodUpdate,
  getLatestMood,
};
