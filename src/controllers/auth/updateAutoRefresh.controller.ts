import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import {
  dataFormatForLocalStorage,
  decodeDetails,
  findUserWithId,
  getUserWithId,
} from "../../services/user.services";
import User from "../../models/usersModel";

export const handleUpdateAutoRefresh = async (req: Request, res: Response) => {
  try {
    const user_detail = req.cookies.user_detail;
    const user: any = decodeDetails(user_detail);
    const checkUserExist = await getUserWithId(user.userId);
    if (!checkUserExist) {
      return responseHandler(res, true, "User not found", null, 404);
    }
    // key and value of auto refresh column
    const { autoRefColName, autoRefValue } = req.body;
     await User.updateOne(
      { _id: user.userId },
      { [autoRefColName]: autoRefValue }
    );
    const updatedUser = await findUserWithId(user.userId)
    
    const userDetails = dataFormatForLocalStorage(updatedUser);
    return responseHandler(
      res,
      false,
      "Auto-refresh updated successfully",
      userDetails,
      200
    );
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in updating the auto refresh status",
      null,
      500
    );
  }
};
