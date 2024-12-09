import { Request, Response } from "express";
import { decodeDetails, dataFormatForLocalStorage, findUserWithId } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";

export const handleGetUserProfile = async (req: Request, res: Response) => {
  try {
    // Decode user details from the cookie
    const user_detail = req.cookies.user_detail;
    const user: any = decodeDetails(user_detail);

    // Fetch the user from the database
    let checkUserInDb = await findUserWithId(user.userId);
    if (!checkUserInDb) {
      return responseHandler(res, true, "User not found", null, 404);
    }

    const userWithProfilePicture = await dataFormatForLocalStorage(checkUserInDb)

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
