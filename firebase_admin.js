const admin = require("firebase-admin");
const initializeAdmin = () => {
  try {
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (err) {
    console.error("Error initializing Firebase Admin SDK:", error.message);
    console.error(
      "Please ensure serviceAccountKey.json is in the correct directory and valid."
    );
    process.exit(1);
  }
};

module.exports = initializeAdmin;
