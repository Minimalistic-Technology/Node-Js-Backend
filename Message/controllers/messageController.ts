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
        // WhatsApp functionality removed - message logging only
        messageLog.push({ number, message, timestamp: Date.now() });

        res.status(200).json({ 
            success: true, 
            message: 'Message logged successfully (WhatsApp integration removed)' 
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to process message', details: error.message });
    }
};
