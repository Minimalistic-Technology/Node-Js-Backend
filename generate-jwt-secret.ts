import crypto from 'crypto';

const secretKey: string = crypto.randomBytes(32).toString('base64');

console.log('Your JWT Secret Key:');
console.log(secretKey);
