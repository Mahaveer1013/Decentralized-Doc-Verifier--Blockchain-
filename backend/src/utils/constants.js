import dotenv from 'dotenv';

dotenv.config()

export const Port = process.env.PORT || 5005;
export const secretKey = process.env.SECRET_KEY;
export const jwtSecret = process.env.JWT_SECRET;
export const deployedContract = process.env.DEPLOYED_CONTRACT;
export const mongoUri = process.env.MONGO_URI;
export const senderEmail = process.env.EMAIL;
export const senderEmailPassword = process.env.EMAIL_PASSWORD;
export const privateKey = process.env.PRIVATE_KEY;
