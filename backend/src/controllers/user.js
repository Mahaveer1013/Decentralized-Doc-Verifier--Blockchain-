import UserModel from "../models/user.model.js";
import { decryptPrivateKey } from "../utils/functions.js";

export async function getPrivateKey() {
    const data = await UserModel.findOne({ email: 'a@gmail.com' });
    const privateKey = await decryptPrivateKey(data.encrypted_private_key)

    console.log(privateKey);
    
    return privateKey;
}