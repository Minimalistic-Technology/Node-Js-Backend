const client = require('../utils/whatsappClient');

let messageLog = [];

exports.sendMessage = async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required' });
    }

    try {
        const waNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await client.sendMessage(waNumber, message);

        messageLog.push({ number, message, timestamp: Date.now() });

        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

exports.messageLog = messageLog;
