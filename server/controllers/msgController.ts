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

const getMessages = async (req: Request, res: Response) => {
    try {
        const receiverID = req.params.id;
        const senderID = req.user.id;

        const conversation = await prisma.conversation.findFirst({
            where: { 
                AND: [
                    {users: {some: {id: senderID}}},
                    {users: {some: {id: receiverID}}}
                ]
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!conversation) {
            res.status(200).json({ messages: [] });
            return;
        }
        res.status(200).json(conversation.messages);
        return;
    }
    catch (error: any) {
        console.log("get messages error", error.message);
        res.status(500).json({ error: "server error" });
        return;
    }
}

const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const conversations = await prisma.conversation.findMany({
        where: {
            users: {
                some: {
                id: userId,
                },
            },
        },
        select: {
            users: {
                where: {
                    id: {
                    not: userId, 
                    },
                },
            select: {
                id: true,
                fullname: true,
                pfp: true, 
                },
            },
            messages: {
                orderBy: {
                    createdAt: 'desc',
                },
                take: 1, 
                select: {
                    content: true,
                    createdAt: true,
                },
            },
        },
    });

    res.status(200).json(conversations);
    return;
        
    } catch (error: any) {
        console.log("get conversations error", error.message);
        res.status(500).json({ error: "server error" });
        return;
        
    }
}
export { sendMessage, getMessages, getConversations };