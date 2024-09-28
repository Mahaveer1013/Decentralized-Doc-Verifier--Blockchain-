import { configDotenv } from 'dotenv';

configDotenv()

export const PORT = process.env.PORT || 5005;
export const secretKey = process.env.SECRET_KEY;
