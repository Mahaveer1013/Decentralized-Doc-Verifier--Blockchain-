import express from 'express';
import { Wallet } from 'ethers';
import { mongoUri, Port, senderEmail, senderEmailPassword } from './constants.js';
import UserModel from './models/user.model.js';
import { createToken, encryptPrivateKey, generateOtp, hashDocument, encryptDocument } from './controllers/functions.js';
import { loginRequired } from './middleware/middleware.js';
import mongoose from 'mongoose';
import DocumentModel from './models/document.model.js';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import nodemailer from 'nodemailer'; // Import nodemailer for sending emails
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.static(join(__dirname, 'public')));

const upload = multer({ dest: 'public/uploads/' }); // Temporary storage for uploaded files

const transporter = nodemailer.createTransport({
    service: 'gmail', // Example service
    auth: {
        user: senderEmail, // Your email
        pass: senderEmailPassword, // Your email password
    },
});

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

app.post('/send-document', upload.single('document'), loginRequired, async (req, res) => {
    const { email } = req.body;
    const documentFile = req.file;

    console.log(documentFile);

    if (!documentFile) {
        return res.status(400).json({ message: 'No document uploaded' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User Not found' });
    }

    try {
        // Construct the document path using the temp upload path
        const documentPath = path.join(__dirname, documentFile.path);

        // Read the document as a buffer
        const documentBuffer = fs.readFileSync(documentPath);
        
        // Hash the document for integrity
        const document_hash = await hashDocument(documentBuffer);
        
        // Encrypt the document using the user's public key
        const encrypted_document = encryptDocument(documentBuffer, user.public_key);
        
        // Create a new document entry in the database
        const newDocument = new DocumentModel({
            user_public_key: user.public_key,
            issuer_public_key: req.user.public_key,
            document_hash,
            encrypted_document,
        });

        await newDocument.save();

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail, // Your email
                pass: senderEmailPassword // Your email password or app-specific password
            }
        });

        // Email options
        const mailOptions = {
            from: senderEmail,
            to: email,
            subject: 'Document Sent',
            text: 'You have received a document.',
            attachments: [
                {
                    filename: documentFile.originalname, // Original name of the uploaded file
                    content: encrypted_document // This should be a Buffer or a readable stream
                }
            ]
        };

        // Send the email with the encrypted document
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email', error });
            }
            console.log('Email sent:', info.response);
        });

        // Optionally, delete the file after processing
        fs.unlinkSync(documentPath);

        res.status(201).json({ message: 'Document sent successfully', document: newDocument });
    } catch (error) {
        console.error('Error sending document:', error);
        res.status(500).json({ message: 'Error sending document', error });
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
