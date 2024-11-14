import { Request, Response, NextFunction } from 'express';
import { auth } from 'firebase-admin';
import { responseHandler } from './responseHandler';
import admin from './firebaseConfig';
import { getAppCheck } from "firebase-admin/app-check";
import { initializeApp } from "firebase-admin/app";
export const validateFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const firebaseApp = initializeApp();
  try {
    // const accessToken = req.cookies.access_token;

    // if (!accessToken) {
    //   return responseHandler(
    //     res,
    //     true,
    //     'No token found Unauthorized, please login again',
    //     null,
    //     401
    //   );
    // }
const accessToken = "CR0mgpIMycKnCUDwS0vlPlo_38ZBAfMeSghjInhuMDAAAAGTJaDPbQ"; // put the static token and use "/api/test" route to test
    try {
        const appCheckClaims = await getAppCheck().verifyToken(accessToken);
    //   const decodedToken = await admin.auth().verifyIdToken(accessToken);
    //   req.user = decodedToken;
    console.log(appCheckClaims, 'appCheckClaims');
    
    //   next();
    // for testing the token
    return responseHandler(
        res,
        false,
        'Verified',
        null,
        200
      );
    } catch (error) {
        console.log(error, 'error');
        
      return responseHandler(
        res,
        true,
        'Unauthorized, please login again',
        null,
        401
      );
    }
  } catch (error) {
    return responseHandler(
      res,
      true,
      'Internal server error',
      null,
      500
    );
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