import User from "../models/usersModel";
import * as  jwt from "jsonwebtoken"; 

export const findUserWithEmail = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  return user ? user : null;
};

export const generateOtp = () => {
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return otp;
};

export const createExpirationTime = () => {
  const expirationTime = new Date(Date.now() + 900000);
  return expirationTime;
};


export const encodeDefaultAccountId = (defaultAccountId: string) => {
  const secretKey = process.env.JWT_SECRET || "your_secret_key"; 
  const token = jwt.sign({ defaultAccountId }, secretKey); 
  return token;
};