import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import genToken from "../utils/jwt";

const login = (req: Request, res: Response) => {
  try {
    const { username, plainPassword, confirm } = req.body;

    if (!username || !plainPassword || !confirm) {
       return res.status(400).json({ error: "All fields are required" });
    }

    if (plainPassword !== confirm) {
       return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
       return res.status(400).json({ error: "Invalid credentials" });
    }

  } catch (error: any) {
    console.log("login error", error.message);
    return res.status(500).json({ error: "server error" });
  }

};
const logout = async (req: Request, res: Response) => {
    
};


const register = async (req: Request, res: Response) => {
  try {
    const { fullname, username, plainPassword, confirm } = req.body;

    // check if all fields are provided
    if (!fullname || !username || !plainPassword || !confirm) {
       return res.status(400).json({ error: "All fields are required" });
    }
    if (plainPassword !== confirm) {
       return res.status(400).json({ error: "Passwords do not match" });
    }

    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
       return res.status(400).json({ error: "Username already taken" });
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
        genToken(newUser.username, res);
         return res.status(201).json({
            newUser,
            message: "User created successfully",
      });
    } else {
       return res.status(400).json({ error: "Invalid data" });
    }



  } catch (error: any) {
    console.log("registration error", error.message);
    return res.status(500).json({ error: "server error" });
  }
};




export { login, logout, register };
