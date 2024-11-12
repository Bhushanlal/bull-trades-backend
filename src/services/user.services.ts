import User from "../models/usersModel";

export const findUserWithEmail = async(email : string) =>{
    const user = await User.findOne({ email, isDeleted: false });
    return user ? user : null
}