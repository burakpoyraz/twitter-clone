import jwt from "jsonwebtoken";

export const generateTokenandSetCookie = (userId, res) => {
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite:"Strict",
        secure: process.env.NODE_ENV !== "development",
    });
    }