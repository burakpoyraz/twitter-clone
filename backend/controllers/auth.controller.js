import { generateTokenandSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email format" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenandSetCookie(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullname: newUser.fullname,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  } catch (err) {
    console.log("Error in signup", err.message);
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenandSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });
  } catch (err) {
    console.log("Error in login", err.message);
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
};

export const logout = (req, res) => {

  try
  {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  }
  catch(err)
  {
    console.log("Error in logout", err.message);
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
};


export const getMe = async (req, res) => {
  try{
  
    res.status(200).json(req.user);

  }
  catch(err)
  {
    console.log("Error in getMe", err.message);
    res.status(500).json({ error: "Internal Server Error" + err.message });
  }
}
