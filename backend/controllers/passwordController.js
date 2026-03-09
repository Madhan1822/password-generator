const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const generatePassword = require("../utils/generatePassword");

exports.createPassword = async (req, res) => {
  try {
    const { length, uppercase, lowercase, numbers, symbols } = req.body;

    // Generate password
    const password = generatePassword(length, {
      uppercase,
      lowercase,
      numbers,
      symbols,
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    await pool.query(
      "INSERT INTO passwords (generated_password, hashed_password) VALUES ($1, $2)",
      [password, hashedPassword]
    );

    res.status(201).json({
      message: "Password generated & saved",
      password,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPasswords = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, generated_password, created_at FROM passwords ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
