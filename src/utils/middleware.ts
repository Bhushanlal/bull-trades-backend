import { Request, Response, NextFunction } from "express";
import { auth } from "firebase-admin";
import { responseHandler } from "./responseHandler";
import admin from "./firebaseConfig";
import { getAppCheck } from "firebase-admin/app-check";
export const validateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.access_token;

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
      const appCheckClaims = await getAppCheck().verifyToken(accessToken);
      const decodedToken = await admin.auth().verifyIdToken(accessToken);
      console.log(decodedToken, '');
      
      req.user = decodedToken;
      console.log(appCheckClaims, "appCheckClaims");

      next();
      // for testing the token
      return responseHandler(res, false, "Verified", null, 200);
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
