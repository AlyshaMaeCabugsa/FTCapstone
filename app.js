require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const app = express();

// CORS and Body Parsing Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// View Engine Setup
app.set("view engine", "ejs");

// Routes
const establishmentRoutes = require('./routes/establishment');
const annualRecordsRoutes = require('./routes/annualRecord');
const inspectionRoutes = require('./routes/inspection'); 
const staffContactsRouter = require('./routes/staffContacts');
const pdfRoutes = require('./routes/pdfRoutes');


app.use('/api/establishments', establishmentRoutes);
app.use('/api/annualrecords', annualRecordsRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/staffContacts', staffContactsRouter);
app.use('/pdf', pdfRoutes);


// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch(e => {
    console.error("Database connection error:", e);
    process.exit(1); // Exit with an error
  });

// Additional Models
require("./userDetails");
require('./websocketServer');
require('./services/reminderService.js');



const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.json({ status: "error", error: "User Not found" });
  }
  
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.json({ status: "ok", data: token });
  }

  return res.json({ status: "error", error: "Invalid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  
  try {
    // Correctly use the verify method without a callback to use it in a synchronous way
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Now that we have the decoded token, we can find the user based on the email
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).send({ status: "error", data: "User not found" });
    }

    // If user is found, send the user data
    return res.send({ status: "ok", data: user });

  } catch (error) {
    // If error is thrown from jwt.verify, it will be caught here
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send({ status: "error", data: "token expired" });
    } else {
      return res.status(500).send({ status: "error", data: "An error occurred" });
    }
  }
});


app.listen(5000, () => {
  console.log("Server Started");
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});