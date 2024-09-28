import UserModel from "../models/user.model";

export async function getUser () {
    return await UserModel.findOne({email: 'a@gmail.com'})
}