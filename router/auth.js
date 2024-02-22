const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const jwtKey = process.env.SECRET_KEY;
const authMiddleware = require("../middleware/auth");

authRouter.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(400).json({ message: "bad request" });
    }

    let isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res.status(409).json({ message: "user exists" });
    }

    //add email validation using regex or joi

    let hashedPassword = await bcrypt.hash(password, 10);

    // let newUser = await User.create({ name, email, password:hashedPassword }); //create combines both steps
    let newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    let token = await jwt.sign({ userId: newUser._id }, jwtKey);
    res.status(200).json({ name: newUser.name,jwt: token });
  } catch (error) {
    console.log(error);
  }
});

//create login
//install thunderclient
//create job schema and create job api
//add auth middle ware
//why bearer

authRouter.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "bad request" });
    }

    let userDetails = await User.findOne({ email: email });

    if (!userDetails) {
      return res.status(409).json({ errorMessage: "Invalid Credentials" });
    }

    let isCorrectPassword = await bcrypt.compare(
      password,
      userDetails.password
    );

    if (!isCorrectPassword) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    let token = await jwt.sign({ userId: userDetails._id }, jwtKey);

    res
      .status(200)
      .json({
        name: userDetails.name,
        message: "login successful",
        jwt: token,
      });
  } catch (error) {
    console.log(error);
  }
});

authRouter.patch("/update/password", authMiddleware, async (req, res) => {
  try {
    let { oldPassword ,newPassword} = req.body;

    if (!newPassword || !oldPassword) {
      return res.status(400).json({ message: "bad request" });
    }

    let userDetails = await User.findOne({ _id: req.body.userId });

    let isCorrectPassword = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isCorrectPassword) {
      return res.status(401).json({ errorMessage: "Invalid Credentials" });
    }

    let newHashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id: req.body.userId },
      { $set: { password: newHashedPassword } }
    );

    res.status(200).json({message:"password reset successful"});
  } catch (error) {
    console.log(error);
  }
});

authRouter.patch("/update/name", authMiddleware, async (req, res) => {
  try{
    let {name}=req.body;
    if(!name){
      return res.status(400).json({ message: "bad request" });
    }

    await User.updateOne(
      { _id: req.body.userId },
      { $set: { name } }
    );

    res.status(200).json({message:"name set successfully"});

  }
  catch(error){
    console.log(error);
  }

 

});

module.exports = authRouter;
