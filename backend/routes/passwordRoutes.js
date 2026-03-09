const express = require("express");
const router = express.Router();
const {
  createPassword,
  getPasswords,
} = require("../controllers/passwordController");

router.post("/generate", createPassword);
router.get("/all", getPasswords);

module.exports = router;
