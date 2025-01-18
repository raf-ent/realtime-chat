import { Response } from "express";
import jwt from "jsonwebtoken";

const genToken = (userID: string, res: Response) => {
  jwt.sign({ userID }, process.env.TOKEN_SECRET!, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        console.log("jwt error", err.message);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 24*3600*1000,
        });

        return token;
      }
    }
  );
};


export default genToken;