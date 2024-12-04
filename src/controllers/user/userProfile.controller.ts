import { Request, Response } from "express";
import { decodeDetails, getUserWithId } from "../../services/user.services";
import { responseHandler } from "../../utils/responseHandler";

export const handleGetUserProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const user_detail = req.cookies.user_detail
    const user:any = decodeDetails(user_detail);
    
    const checkUserInDb = await getUserWithId(user.userId);
    if (!checkUserInDb) {
      return responseHandler(res, true, "User not found", null, 404);
    }
   
    return responseHandler(res, false, "User fetched successfully", checkUserInDb, 200);
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in getting the user",
      null,
      500
    );
  }
};
