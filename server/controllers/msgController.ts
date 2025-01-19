import { Request, Response } from "express";
import prisma from "../db/prisma";

const sendMessage = async (req: Request, res: Response) => {
    try {
        const receiverID = req.params.id;
        const { message } = req.body;
        const senderID = req.user.id;
        
        let conversation = await prisma.conversation.findFirst({
            where: { 
                AND: [
                    {users: {some: {id: senderID}}},
                    {users: {some: {id: receiverID}}}
                ]
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    users: {
                        connect: [
                            {id: senderID},
                            {id: receiverID}
                        ]
                    }
                }
            });
        }
        const newMessage = await prisma.message.create({
            data: {
                conversationID: conversation.id,
                senderID,
                content:message,
            }
        });
        if (newMessage) {
			conversation = await prisma.conversation.update({
				where: {
					id: conversation.id,
				},
				data: {
					messages: {
						connect: {
							id: newMessage.id,
						},
                    }}
                });
            }
    res.status(201).json(newMessage);
    return;        

}
catch (error: any) {
        console.log("send message error", error.message);
        res.status(500).json({ error: "server error" });
        return;
        
    }
}
export default sendMessage;