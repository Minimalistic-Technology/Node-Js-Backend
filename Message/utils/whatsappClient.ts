import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

// Create a new WhatsApp client using local authentication
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Event listener for QR code generation
client.on('qr', (qr: string) => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Event listener when the client is ready
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Initialize the client
client.initialize();

// Export the client instance for use in other modules
export default client;
