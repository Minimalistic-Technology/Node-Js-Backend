"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageLog = exports.sendMessage = void 0;
const whatsappClient_1 = __importDefault(require("../../utils/whatsappClient"));
let messageLog = [];
exports.messageLog = messageLog;
const sendMessage = async (req, res) => {
    const { number, message } = req.body;
    if (!number || !message) {
        return res.status(400).json({ error: 'Number and message are required' });
    }
    try {
        const waNumber = number.includes('@c.us') ? number : `${number}@c.us`;
        await whatsappClient_1.default.sendMessage(waNumber, message);
        messageLog.push({ number, message, timestamp: Date.now() });
        return res.status(200).json({ success: true, message: 'Message sent successfully!' });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};
exports.sendMessage = sendMessage;
