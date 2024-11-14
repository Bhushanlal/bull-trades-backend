import { Request, Response } from "express";
import User from "../../models/usersModel";
import {
  createExpirationTime,
  findUserWithEmail,
  generateOtp,
} from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";

export const createOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await findUserWithEmail(email);
    if (!user) {
      return responseHandler(res, true, "User already exists", null, 400);
    }

    const otp = generateOtp();
    const expirationTime = createExpirationTime();
    await User.updateOne(
      { email: email },
      { otp: otp, otpExpiredAt: expirationTime, updatedAt: new Date() }
    ); // 15 minutes expiration

    // email otp 
    return responseHandler(
      res,
      false,
      "Otp created successfully",
      { otpExpiredAt: expirationTime },
      200
    );
  } catch (error) {
    console.error("Otp creation error", error);
    return responseHandler(res, true, "Error while creating otp", null, 500);
  }
};
