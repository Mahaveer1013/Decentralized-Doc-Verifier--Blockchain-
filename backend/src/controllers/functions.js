import { jwtSecret, secretKey } from '../constants.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken'

const iv = crypto.randomBytes(16); // Initialization vector

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Prepend IV for decryption
};

export const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

export const encryptPrivateKey = (privateKey) => {
    console.log(secretKey , '\n\n\n\n');
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf8'), iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(`\n\n\n\n${iv.toString('hex')}:${encrypted}`);
    
    return `${iv.toString('hex')}:${encrypted}`;
};

export const decryptPrivateKey = (encryptedPrivateKey) => {
    const [ivHex, encrypted] = encryptedPrivateKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf8'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export const createToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        jwtSecret,                          
        { expiresIn: '1h' }                 
    );
};

export const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};

export const hashFile = (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
};