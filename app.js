require("dotenv").config();
require("./config/dbConfig.js");
const PORT = process.env.PORT || 5000;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const User = require("./models/userModel.js");
const { generateOTP } = require("./utils/otpHelper.js");
const { sendOtpEmail } = require("./utils/emailHelper.js");
const bcrypt = require("bcrypt");
const OTP = require("./models/otpModel.js");

//----------------------------------------------------------------------------------

const app = express();

//----------------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("request received -->", req.url);
  next();
});

app.use(morgan("dev"));

app.get("/users", (req, res) => {
  try {
  } catch (err) {
    console.log("Error in GET /users");
    console.log(err.message);
    res.status(500);
    res.json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});
app.post("/users", async (req, res) => {
  try {
    const userInfo = req.body;
    const newUser = await User.create(userInfo);
    res.status(201);
    res.json({
      status: "success",
      data: {
        user: {
          email: newUser.email,
          fullName: newUser.fullName,
        },
      },
    });
  } catch (err) {
    console.log("Error in POST /users");
    console.log(err.name, err.code);
    console.log(err.message);
    if (err.name == "ValidationError") {
      res.status(400);
      res.json({
        status: "fail",
        message: "Data validation failed" + err.message,
      });
    } else if (err.code === 11000) {
      res.status(400);
      res.json({
        status: "fail",
        message: "Email already exists",
      });
    } else {
      res.status(500);
      res.json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
  }
});

app.post("/otp", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    res.status(400);
    res.json({
      status: "fail",
      message: 'Missing required parameters:"email"',
    });
    return;
  }
  const otp = generateOTP();

  const isEmailSent = await sendOtpEmail(email, otp);
  //console.log("isEmailSent:",isEmailSent);
  if (!isEmailSent) {
    res.status(500).json({
      status: "fail",
      message: "Email could not be sent! Please try again after 30 seconds!",
    });
    return;
  }

  const newSalt = await bcrypt.genSalt(10);
const hashedOtp = await bcrypt.hash(otp.toString(),newSalt);



 
  await OTP.create({
    email,
    otp:hashedOtp,
  });

  res.status(201);
  res.json({
    status: "success",
    message: `OTP sent to ${email}`,
  });
});

//----------------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `--------------------------Server Started on PORT: ${PORT}--------------------------`
  );
});

// const testing = async() =>{


// console.time("hash1");


// console.log("salt =",newSalt);
// console.log("hash =", newHash);

 
// console.timeEnd("hash1");

// };

// testing();
