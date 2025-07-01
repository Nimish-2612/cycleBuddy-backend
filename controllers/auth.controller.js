const { getDb } = require("../config/data");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const { name, password } = req.body;
  const db = getDb();

  const users = db.collection("users");
  try {
    const user = await users.findOne({ name });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res.status(500).json({ message: "Password is missing in DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, isBoyfriend: user.isBoyfriend,name:user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        isBoyfriend: user.isBoyfriend
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
}

module.exports = {
  login
};
