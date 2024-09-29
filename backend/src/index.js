import express from 'express';
import { Wallet } from 'ethers';
import { mongoUri, Port, senderEmail, senderEmailPassword } from './utils/constants.js';
import UserModel from './models/user.model.js';
import { createToken, encryptPrivateKey, generateOtp, hashDocument, encryptDocument } from './utils/functions.js';
import { loginRequired } from './middleware/middleware.js';
import mongoose from 'mongoose';
import crypto from 'crypto'
import fs from 'fs';
import multer from 'multer'
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { FIREBASE_CONFIG } from './event-db-393fb-firebase-adminsdk-92cxv-f3862a5964.js';
import admin from 'firebase-admin'
import { addDocument, getDocuments, registerUser } from './contracts/ContractConnection.js';

const app = express();

// getPrivateKey()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.static(join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

admin.initializeApp({
    credential: admin.credential.cert(FIREBASE_CONFIG),
    storageBucket: "event-db-393fb.appspot.com" // Replace with your bucket name
});

const transporter = nodemailer.createTransport({
    service: 'gmail', // Example service
    auth: {
        user: senderEmail, // Your email
        pass: senderEmailPassword, // Your email password
    },
});

app.get('/dec', (req, res) => {
    dec()
    res.send('done');
})

app.get('/get', (req, res) => {
    getNumber()
    res.send('done');
})

app.get('/set', (req, res) => {
    setNumber(1)
    res.send('done');
})

app.get('/inc', (req, res) => {
    inc()
    res.send('done');
})

app.get('/user', loginRequired, (req, res) => {
    res.status(200).json(req.user)
})

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const otp = generateOtp();
        const user = await UserModel.findOneAndUpdate(
            { email },
            { otp: { code: otp, createdAt: new Date() } },
            { new: true }
        );

        await transporter.sendMail({
            from: senderEmail,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending OTP', error });
    }
});

app.post('/register', async (req, res) => {
    const { email, password, user_type } = req.body;

    try {
        const wallet = Wallet.createRandom();
        const private_key = wallet.privateKey;
        const public_key = wallet.address;

        const encrypted_private_key = encryptPrivateKey(private_key);
        const hashedPassword = await bcrypt.hash(password, 10);

        const emailExists = await UserModel.findOne({ email: email })
        if (emailExists) {
            return res.status(403).json({ message: 'Email Already Exists' })
        }

        const user = new UserModel({ email, password: hashedPassword, encrypted_private_key, public_key, user_type });
        await user.save();

        // blockchain call

        await registerUser(public_key)



        const token = createToken({
            email, public_key
        });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = createToken({
            email: user.email,
            public_key: user.public_key
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || user.otp.code !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP is expired (optional, depending on your requirements)
        const otpCreatedAt = user.otp.createdAt;
        const isExpired = (new Date() - otpCreatedAt) > 300000; // 5 minutes expiration
        if (isExpired) {
            return res.status(401).json({ message: 'OTP has expired' });
        }

        // Reset OTP after successful verification
        user.otp = { code: '', createdAt: null }; // Clear OTP
        user.is_verified = true; // Mark user as verified
        await user.save();

        const token = createToken({
            email: user.email,
            public_key: user.public_key
        });

        res.status(200).json({ message: 'Verification successful', token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
});

function getFileHash(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256'); // You can change the algorithm if needed
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            hash.update(data);
        });

        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

async function encryptAndUploadFile(tmpPath, originalName, key, algo) {
    const fileHash = await getFileHash(tmpPath);
    const cipher = crypto.createCipher(algo, key);
    const fileBuffer = fs.readFileSync(tmpPath); // Read file into memory

    // Encrypt the file buffer
    const encryptedBuffer = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
    ]);

    const bucket = admin.storage().bucket();
    const targetPath = `uploads/${originalName}.enc`;

    // Upload the encrypted file buffer to Firebase Storage
    const file = bucket.file(targetPath);
    await file.save(encryptedBuffer, {
        metadata: {
            contentType: 'application/octet-stream', // Change as necessary
            cacheControl: 'no-cache'
        }
    });

    // Clean up temporary file
    fs.unlinkSync(tmpPath);

    return {
        status: "success",
        message: "File uploaded and encrypted successfully",
        fileHash: fileHash,
        targetPath: targetPath
    };
}

app.post('/send-document', upload.single('file'),loginRequired, async (req, res) => {
    if (!req.file) {
        console.log('wefrgtbnh');
        
        return res.json({ status: "error", message: "Please upload a file." });
    }

    const user_email = req.body.email
    if (!user_email) {
        console.log('cdvfbgnh');

        return res.status(404).json({message: 'User Not found'})
    }

    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
        console.log('fergtb');

        return res.status(404).json({message: 'User Not Found'})
    }
    const tmpPath = req.file.path;
    const fname = req.file.originalname;
    const key = user.public_key; // Ensure this is securely managed

    if (!key) {
        fs.unlinkSync(tmpPath);
        return res.json({ status: "error", message: "Encryption key is required." });
    }

    const selfUser = await UserModel.findOne({email: req.user.email})

    const algo = req.body.ealgo || 'aes-256-cbc';

    try {
        const result = await encryptAndUploadFile(tmpPath, fname, key, algo);

        // const data = new Docum({ user_public_key: key, issuer_public_key: selfUser.public_key, document_hash: result.fileHash, encrypted_document: result.targetPath });
        // await data.save()


        //blockchain call
        await addDocument(key, selfUser.public_key, result.fileHash, result.targetPath) 
        
        
        return res.json({data: 'success'});
    } catch (error) {
        return res.json(error);
    }
});

app.post('/get-my-documents', async (req, res) => {

    // const email = req.user.email
    // if (!email) {
    //     return res.status(404).json({message: 'User Not found'})
    // }

    const user = await UserModel.findOne({ email: 'a@gmail.com' });
    if (!user) {
        return res.status(404).json({message: 'User Not Found'})
    }
    const key = user.public_key; // Ensure this is securely managed

    if (!key) {
        return res.json({ status: "error", message: "Encryption key is required." });
    }

    try {
        const result = await getDocuments(key);
        console.log(result);
        return res.json(result);
    } catch (error) {
        return res.json(error);
    }
});

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(Port, () => {
            console.log(`Server is running on port http://localhost:${Port}`);
        });
    })
    .catch(error => {
        console.error('Database connection error:', error);
    });
