import { JWT_SECRET } from "../utils/envConstants";
import User from "../models/usersModel";
import * as jwt from "jsonwebtoken";
import { getPresignedUrl } from "./commonServices";

export const findUserWithEmail = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false });
  return user ? user : null;
};

export const getUserWithId = async (_id: string) => {
  const user = await User.findOne({ _id, isDeleted: false }).select(
    "-token -provider -isDeleted -deletedAt -otp -otpExpiredAt -updatedAt -createdAt -__v -isVerified -profileVisibility"
  );
  return user ? user : null;
};

export const findUserWithId = async (_id: string) => {
  const user = await User.findOne({ _id, isDeleted: false });
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

export const encodeDetails = (data: any) => {
  const secretKey = JWT_SECRET || "your_secret_key";
  const token = jwt.sign(data, secretKey);
  return token;
};

export const decodeDetails = (token: string) => {
  const secretKey = JWT_SECRET || "your_secret_key";
  try {
    const decodedData = jwt.verify(token, secretKey);
    return decodedData;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const dataFormatForLocalStorage = async (user: any) => {
  let profilePicture = null;

  // Check if profilePicture exists before getting the presigned URL
  if (user.profilePicture) {
    profilePicture = await getPresignedUrl(user.profilePicture);
  }

  const userDetails = {
    email: user.email,
    fullname: user.fullname,
    _id: user._id,
    phoneNumber: user.phoneNumber,
    profilePicture, // Will be null if not provided
    gender: user.gender,
    optionFlowRefresh: user.optionFlowRefresh || false,
  };
  return userDetails;
};
