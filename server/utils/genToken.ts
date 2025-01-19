import { Response } from "express";
import jwt from "jsonwebtoken";

const genToken = (userID: string, res: Response) => {
  const token = jwt.sign({ userID }, process.env.TOKEN_SECRET!, {
    expiresIn: "1d"
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 3600 * 1000,
  });

  return;
};

export default genToken;