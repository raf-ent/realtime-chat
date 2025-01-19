import { Request, Response } from "express";
import prisma from "../db/prisma";
import bcryptjs from "bcryptjs";
import genToken from "../utils/genToken";


const login = async (req: Request, res: Response) => {
  try {
    const { username, plainPassword, confirm } = req.body;

    if (!username || !plainPassword || !confirm) {
       res.status(400).json({ error: "All fields are required" });
       return;
    }

    if (plainPassword !== confirm) {
       res.status(400).json({ error: "Passwords do not match" });
       return;

    }

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
       res.status(400).json({ error: "Invalid credentials" });
       return;

    }

    const passwordMatch = await bcryptjs.compare(plainPassword, user.password);

    if (!passwordMatch) {
       res.status(400).json({ error: "Invalid credentials" });
       return;

    }
    else {
      genToken(user.id, res);
       res.status(200).json({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        pfp: user.pfp,
        message: "Login successful" });
      return;

    }


  } catch (error: any) {
    console.log("login error", error.message);
     res.status(500).json({ error: "server error" });
     return;
  }

};

const logout = async (req: Request, res: Response) => {
  try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });

	} catch (error: any) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "server error" });
	}

};

const register = async (req: Request, res: Response) => {
  try {
    const { fullname, username, plainPassword, confirm } = req.body;

    // check if all fields are provided
    if (!fullname || !username || !plainPassword || !confirm) {
       res.status(400).json({ error: "All fields are required" });
       return;
    }
    if (plainPassword !== confirm) {
       res.status(400).json({ error: "Passwords do not match" });
       return;
    }

    // check if user already exists
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
       res.status(400).json({ error: "Username already taken" });
       return;
    }

    // hash password
    const password = await bcryptjs.hash(plainPassword, 10);

    // generate profile picture
    const pfp = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullname
    )}&size=250`;

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
      genToken(newUser.id, res);
       res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        fullname: newUser.fullname,
        pfp: newUser.pfp,
        message: "User created successfully",
      });
      return;
    } else {
       res.status(400).json({ error: "Invalid data" });
       return;
    }



  } catch (error: any) {
    console.log("registration error", error.message);
     res.status(500).json({ error: "server error" });
     return;
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
       res.status(404).json({ error: "User not found" });
       return;
    }
      res.status(200).json({
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        pfp: user.pfp
      });

      return;

  } catch (error: any) {
    console.log("getProfile error", error.message);
     res.status(500).json({ error: "server error" });
     return;
    
  }
}




export { login, logout, register, getProfile};
