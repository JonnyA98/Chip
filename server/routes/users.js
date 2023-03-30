const knex = require("knex")(require("../../knexfile"));
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  const { name, user_email, password } = req.body;

  if (!name || !email || !password || Object.keys(req.body).length > 3) {
    return res.status(400).json({
      error: true,
      message: "Incomplete POST body",
      requiredProperties: ["user_name", "user_email", "user_password"],
    });
  }
  const bodyUserEmail = email;
  const userExists = await knex("users").where({ email: bodyUserEmail });

  if (userExists.length) {
    return res.status(400).json({
      error: true,
      message: `Could not add to warehouse with email: ${bodyUserEmail} as this email has been taken.`,
    });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Couldn't encrypt the supplied password" });
    }

    try {
      await knewx("users").insert({ ...req.body, password: hashedPassword });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  });
});
