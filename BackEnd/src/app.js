const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./db/db");
const userRoute = require("./routes/user/user.route");
const adminRoute = require("./routes/admin/admin.route");

connectDB();
require("./automation/booking.automation");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/stayzio/user", userRoute);
app.use("/stayzio/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;

