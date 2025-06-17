import { Request, Response } from 'express';
import client from '../../utils/whatsappClient';

interface MessageEntry {
    number: string;
    message: string;
    timestamp: number;
}

let messageLog: MessageEntry[] = [];

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required' });
    }

    try {
        const waNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(waNumber, message);

        messageLog.push({ number, message, timestamp: Date.now() });

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

export { messageLog };