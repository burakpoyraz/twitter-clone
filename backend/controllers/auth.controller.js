import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid Email format" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
    }
    const existingMail = await User.findOne({ email });
    if (existingMail) {
      res.status(400).json({ error: "Email already exists" });
    }

    //hashing password
    const salt = bcrypt.genSalt(10);
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
      res
        .status(200)
        .json({
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = (req, res) => {
  res.json({
    message: "You hit the login endpoint",
  });
};

export const logout = (req, res) => {
  res.json({
    message: "You hit the logout endpoint",
  });
};
