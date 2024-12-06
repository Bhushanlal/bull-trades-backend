import { Request, Response } from "express";
import { getUserWithId, decodeDetails } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";
import { getPresignedUrl } from "../../services/commonServices";

export const handleGetUserProfile = async (req: Request, res: Response) => {
  try {
    // Decode user details from the cookie
    const user_detail = req.cookies.user_detail;
    const user: any = decodeDetails(user_detail);

    // Fetch the user from the database
    let checkUserInDb = await getUserWithId(user.userId);
    if (!checkUserInDb) {
      return responseHandler(res, true, "User not found", null, 404);
    }

    // Generate a pre-signed URL for the user's profile picture
    const profilePictureUrl = checkUserInDb.profilePicture
      ? await getPresignedUrl(checkUserInDb.profilePicture)
      : null;

    // Add the pre-signed URL to the user object
    const userWithProfilePicture = {
      ...checkUserInDb.toObject(),
      profilePicture: profilePictureUrl,
    };

    return responseHandler(
      res,
      false,
      "User fetched successfully",
      userWithProfilePicture,
      200
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return responseHandler(res, true, "Error in getting the user", null, 500);
  }
};
