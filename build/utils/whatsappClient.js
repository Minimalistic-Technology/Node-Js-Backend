"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const whatsapp_web_js_1 = require("whatsapp-web.js");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
// Create a new WhatsApp client using local authentication
const client = new whatsapp_web_js_1.Client({
    authStrategy: new whatsapp_web_js_1.LocalAuth(),
});
// Event listener for QR code generation
client.on('qr', (qr) => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode_terminal_1.default.generate(qr, { small: true });
});
// Event listener when the client is ready
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});
// Initialize the client
client.initialize();
// Export the client instance for use in other modules
exports.default = client;
