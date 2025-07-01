const express = require("express");
const dotenv = require("dotenv");
const { initDb } = require("./config/data");
const authRoutes = require("./routes/auth.routes");
const moodRoutes = require("./routes/mood.routes");
const firebaseRoutes = require("./routes/firebase.routes");
const cors = require("cors");
const initializeAdmin = require("./firebase_admin");
dotenv.config();

const app = express();
app.use(
  cors({
    // origin: "http://localhost:5173"||"http://localhost:5174",
    credentials: true,
  })
);
initializeAdmin();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/notify", firebaseRoutes);
initDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
