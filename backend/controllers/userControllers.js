const expressAsyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

const sendEmail = (email, uniqueString) => {
  var Transport = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "swifttalk.messenger@outlook.com",
      pass: "mnbv0987",
    },
  });

  var mailOptions = {
    from: '"SwiftTalk" <swifttalk.messenger@outlook.com>"',
    to: email,
    subject: "Confirm your SwiftTalk account",
    html: `Press <a href="http://localhost:6000/verify/${uniqueString}"> here </a> to verify your account.`,
  };

  Transport.sendMail(mailOptions, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success");
    }
  });
};

const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, pic, publicKey, privateKeyCipher } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Input data is incomplete");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  let _token = generateToken(email);
  const user = await User.create({
    name,
    email,
    password,
    pic,
    activated: false,
    activationKey: _token,
    publicKey,
    privateKeyCipher,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      activated: false,
      pic: user.pic,
      token: _token,
      publicKey: publicKey,
    });
  } else {
    res.status(400);
    throw new Error("User creation failed");
  }
  sendEmail(user.email, _token);
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user.activated === false) {
    res.status(401);
    throw new Error("Account not activated");
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
      publicKey: user.publicKey,
      privateKeyCipher: user.privateKeyCipher,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
const allUsers = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const updateUser = expressAsyncHandler(async (req, res) => {
  const { pic, user } = req.body;
  console.log(pic, user.email);
  const update = async () => {
    const result = await User.updateOne(
      {
        email: user.email,
      },
      {
        $set: {
          pic: pic,
        },
      }
    );
    console.log(result);
    res.status(200).send("updated Image");
  };
  update();
});

module.exports = { registerUser, authUser, allUsers, updateUser };
