import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import prisma from "../db/prisma";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.TOKEN_SECRET!;


declare global {
	namespace Express {
		export interface Request {
			user: {
				id: string;
			};
		}
	}
}


const verifyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        
        const verified = jwt.verify(token, secret) as {userID: string};

        if (!verified) {
            res.status(401).json({ error: "Unauthorized token" });
        }
        
        const user = await prisma.user.findUnique({
            where: {id: verified.userID},
            select: {id: true, username: true, pfp: true, fullname: true}
        });

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        req.user = user;

        next();

    } catch (error: any) {
        console.log("verifyProfile error", error.message);
        res.status(500).json({ error: "server error" });
        return;
        
    }

}

export default verifyProfile;