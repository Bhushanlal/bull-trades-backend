import { Request, Response } from "express";
import User from "../../models/usersModel";
import { findUserWithId, getUserWithId } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";
import admin from "../../utils/firebaseConfig";
import { isValidObjectId } from "mongoose";
import { deleteS3Imgs, uploadFileToS3 } from "../../services/commonServices";

export const handleUpdateUserProfile = async (req: Request, res: Response) => {
  try {
    const { fullname, phoneNumber, gender } = req.body;
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

    // Check for file
    const imgFile = req.file;
    let profileImageUrl;

    if (imgFile) {
      // File size validation: max 5 MB
      const maxFileSize = 5 * 1024 * 1024;
      if (imgFile.size > maxFileSize) {
        return responseHandler(
          res,
          false,
          "File size should not exceed 5 MB.",
          null,
          400
        );
      }

      // File type validation: allow only JPEG, JPG, and PNG
      const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedFileTypes.includes(imgFile.mimetype)) {
        return responseHandler(
          res,
          false,
          "Only JPEG, JPG, and PNG formats are allowed.",
          null,
          400
        );
      }
      profileImageUrl = await uploadFileToS3(imgFile, userId);

      // Optional: delete old image if exists
      if (checkUserInDb.profilePicture) {
        await deleteS3Imgs(checkUserInDb.profilePicture);
      }
    }

    await User.updateOne(
      { _id: userId, isDeleted: false },
      {
        fullname: fullname ? fullname : checkUserInDb.fullname,
        phoneNumber: phoneNumber ? phoneNumber : checkUserInDb.phoneNumber,
        profilePicture: profileImageUrl
          ? profileImageUrl
          : checkUserInDb.profilePicture,
        gender: gender ? gender : checkUserInDb.gender,
      }
    );

    return responseHandler(
      res,
      false,
      "Profile updated successfully",
      null,
      200
    );
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
