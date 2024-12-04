import { Request, Response, NextFunction } from "express";
import { auth } from "firebase-admin";
import { responseHandler } from "./responseHandler";
import admin from "./firebaseConfig";
// import { getAppCheck } from "firebase-admin/app-check";
import User from "../models/usersModel";
import { encodeDetails, findUserWithEmail } from "../services/user.services";
export const validateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the token from the headers
    const getAccessToken = req.headers.authorization
    const accessToken = getAccessToken?.split(' ')[1];

    if (!accessToken) {
      return responseHandler(
        res,
        true,
        "No token found Unauthorized, please login again",
        null,
        401
      );
    }
    try {
      const decodedToken = await admin.auth().verifyIdToken(accessToken);

      if (!decodedToken.email_verified) {
        return responseHandler(
          res,
          true,
          "Email not verified! Please verify your email.",
          null,
          400
        );
      }

      req.user = decodedToken;
      // Get user details
      const user = await findUserWithEmail(req.user.email);
      // Check if both tokens are same ?
      if (user.token != accessToken) {
        await User.updateOne(
          { email: user.email, isDeleted: false },
          {
            token: accessToken,
            updatedAt: new Date(),
            otp: null,
            otpExpiredAt: null,
          }
        );
        const dateToBeEncoded = {
          userId : user._id,
          defaultAccountId: user.defaultAccount,
        }
        
        const encodeDefaultId = encodeDetails(dateToBeEncoded);
        // Set the new token in cookies 
        res.cookie("access_token", accessToken, { httpOnly: true });
        res.cookie("user_detail", encodeDefaultId, { httpOnly: true });
      }

      next();
    } catch (error) {
      console.log(error, "error");

      return responseHandler(
        res,
        true,
        "Unauthorized, please login again",
        null,
        401
      );
    }
  } catch (error) {
    console.log(error, "error");
    return responseHandler(res, true, "Internal server error", null, 500);
  }
};

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: auth.DecodedIdToken;
    }
  }
}
