const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const bycrypt = require("bcrypt");

const app = express();

if (!process.env.BACKEND_PORT) {
  process.env.BACKEND_PORT === 3001;
}
app.listen(process.env.BACKEND_PORT, () => {
  console.log("Server started on port 3001");
});
