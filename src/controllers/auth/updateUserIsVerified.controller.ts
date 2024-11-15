import { Request, Response } from "express";
import User from "../../models/usersModel";
import { findUserWithEmail } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";
import admin from "../../utils/firebaseConfig";

export const handleUpdateUserIsVerified = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    const checkUserInDb = await findUserWithEmail(email);
    if (!checkUserInDb) {
      return responseHandler(res, true, "User not found", null, 404);
    }

    try {
      const checkFirebaseStatus = await admin
        .auth()
        .getUser(checkUserInDb.uuid);
      if (!checkFirebaseStatus.emailVerified) {
        return responseHandler(
          res,
          true,
          "User does not have a verfied firebase account",
          null,
          401
        );
      }
    } catch (firebaseError) {
      console.error("Firebase getUser error:", firebaseError);
      if (firebaseError.code === "auth/user-not-found") {
        return responseHandler(
          res,
          true,
          "User not found in Firebase",
          null,
          404
        );
      }
      return responseHandler(
        res,
        true,
        "Error verifying user with Firebase",
        null,
        500
      );
    }

    await User.updateOne(
      { email: email, isDeleted: false },
      { isVerified: true }
    );

    return responseHandler(res, false, "User verified successfully", null, 200);
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in updating the status",
      null,
      500
    );
  }
};
