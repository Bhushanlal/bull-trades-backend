import User from "../models/usersModel";

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
