import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import User from "../../models/usersModel";
import { findUserWithEmail } from "../../services/user.services";

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, accessToken, otp } = req.body;
    const user = await findUserWithEmail(email);
    if (!user) {
      return responseHandler(res, true, "User not found", null, 404);
    }
    if (!user.isVerified) {
      return responseHandler(
        res,
        true,
        "Please verify email before login.",
        null,
        400
      );
    }

    if (otp !== user.otp) {
      return responseHandler(res, true, "Invalid OTP", null, 401);
    }
    const currentTime = new Date();
    if (currentTime > user.otpExpiredAt) {
      return responseHandler(
        res,
        true,
        "OTP is expired. Please try resending.",
        null,
        401
      );
    }
    await User.updateOne(
      { email: email, isDeleted: false },
      {
        token: accessToken,
        updatedAt: new Date(),
        otp: null,
        otpExpiredAt: null,
      }
    );
    res.cookie("access_token", req.body.accessToken, { httpOnly: true });
    return responseHandler(res, false, "Login successful", null, 200);
  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, true, "Error while login", null, 500);
  }
};

export default handleLogin;
