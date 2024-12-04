import { Request, Response } from "express";
import User from "../../models/usersModel";
import { findUserWithId, getUserWithId } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";
import admin from "../../utils/firebaseConfig";
import { isValidObjectId } from "mongoose";

export const handleUpdateUserProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const { fullname, profilePicture, phoneNumber, gender} = req.body;
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return responseHandler(res, true, "Invalid user ID format", null, 400);
    }
    const checkUserInDb = await findUserWithId(userId);
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
      { _id: userId, isDeleted: false },
      {
        fullname: fullname ? fullname : checkUserInDb.fullname,
        phoneNumber: phoneNumber ? phoneNumber : checkUserInDb.phoneNumber,
        profilePicture: profilePicture ? profilePicture : null,
        gender: gender ? gender : checkUserInDb.gender
      }
      
    );
    const updatedUser = await getUserWithId(userId)

    return responseHandler(res, false, "Profile updated successfully", updatedUser, 200);
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in updating the user profile",
      null,
      500
    );
  }
};
