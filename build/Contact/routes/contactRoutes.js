"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        res.status(400).json({ error: "All fields are required" });
        return;
    }
    try {
        await (0, sendMail_1.default)({
            email,
            subject: "New Contact Message",
            template: "contact.ejs", // make sure this template exists in /mails
            data: { name, email, message }
        });
        res.status(200).json({ message: "Email sent successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});
exports.default = router;
