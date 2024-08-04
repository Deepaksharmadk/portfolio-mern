import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import uploadOnCloudinary from "../utils/cloudinary.js";

const register = async (req, res) => {
  try {
    const { fullName, email, aboutMe, password } = req.body;
    console.log(fullName, email, aboutMe, password);

    if (!(fullName, email, aboutMe, password)) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(409)
        .json({ message: "User with email already exists" });
    }

    let avatar = {};
    let resume = {};
    if (req.files && req.files.avatar) {
      const avatarUpload = await uploadOnCloudinary(req.files.avatar[0].path);
      // console.log(avatarUpload);
      avatar = {
        public_id: avatarUpload.public_id,
        url: avatarUpload.url,
      };
    } else {
      return res.status(400).json({ message: "Avatar is required" });
    }

    if (req.files && req.files.resume) {
      const resumeUpload = await uploadOnCloudinary(req.files.resume[0].path);
      resume = {
        public_id: resumeUpload.public_id,
        url: resumeUpload.url,
      };
    } else {
      return res.status(400).json({ message: "Resume is required" });
    }

    const newUser = await User.create({
      fullName,
      email,
      aboutMe,
      password,

      avatar,
      resume,
    });

    const createdUser = await User.findById(newUser._id);
    // console.log(createdUser);

    const token = jwt.sign(
      { userId: createdUser._id, role: createdUser.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: createdUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
    });
    return res.status(200).json({ "user logged in successfully": user, token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const getuser = async (req, res) => {
  res.status(200).send({ userId: req.userId });
};
const logout = async (req, res) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send("user logged out successfully");
};
export { register, login, getuser, logout };
