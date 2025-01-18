import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import token from "../utils/jwt";
import dotenv from "dotenv";


dotenv.config();

const login = (req: Request, res: Response) => {};

const logout = async (req: Request, res: Response) => {
    
};


const register = async (req: Request, res: Response) => {
  try {
    const { fullname, username, plainPassword, confirm } = req.body;

    // check if all fields are provided
    if (!fullname || !username || !plainPassword || !confirm) {
       res.status(400).json({ error: "All fields are required" });
    }
    if (plainPassword !== confirm) {
       res.status(400).json({ error: "Passwords do not match" });
    }

    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
       res.status(400).json({ error: "Username already taken" });
    }

    // hash password
    const password = await bcryptjs.hash(plainPassword, 10);

    // generate profile picture
    const pfp = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&size=250`;

    // create new user
    const newUser = await prisma.user.create({
      data: {
        fullname,
        username,
        password,
        pfp,
      },
    });

    // generate token
    if (newUser) {
        token(newUser.username, res);
         res.status(201).json({
            newUser,
            message: "User created successfully",
      });
    } else {
       res.status(400).json({ error: "Invalid data" });
    }



  } catch (error: any) {
    console.log("registration error", error.message);
     res.status(500).json({ error: "server error" });
  }
};




export { login, logout, register };
