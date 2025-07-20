import { Request, Response } from 'express';

interface MessageEntry {
    number: string;
    message: string;
    timestamp: number;
}

let messageLog: MessageEntry[] = [];

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { number, message } = req.body;

    if (!number || !message) {
        res.status(400).json({ error: 'Number and message are required' });
        return;
    }

    try {
        const waNumber = number.includes('@c.us') ? number : `${number}@c.us`;

        messageLog.push({ number, message, timestamp: Date.now() });

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};
