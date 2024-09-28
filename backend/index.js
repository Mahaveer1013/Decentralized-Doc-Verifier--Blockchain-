import express from 'express';
import connectDB from './db';
import User from './userModel';
import crypto from 'crypto';
import NodeRSA from 'node-rsa';
import { PORT, secretKey } from './constants';

const app = express();

console.log(PORT);

app.use(express.json());

connectDB();

const encryptPrivateKey = (privateKey) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf8'), iv);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Return IV + encrypted key
};

const decryptPrivateKey = (encryptedPrivateKey) => {
    const [ivHex, encrypted] = encryptedPrivateKey.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf8'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const key = new NodeRSA({ b: 2048 });
        const privateKey = key.exportKey('private');
        const publicKey = key.exportKey('public');

        const encryptedPrivateKey = encryptPrivateKey(privateKey);

        const user = new User({ email, password, privateKey: encryptedPrivateKey, publicKey });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.get('/get-private-key/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const decryptedPrivateKey = decryptPrivateKey(user.privateKey);
        res.status(200).json({ privateKey: decryptedPrivateKey });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving private key', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
