import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { findUserWithEmail } from "../../services/user.services";

export const handleCheckUserExist = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await findUserWithEmail(email);
    if (!user) {
      return responseHandler(res, true, "User not found", null, 404);
    }
    return responseHandler(res, false, "User exists", null, 200);
  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, true, "Error in finding the user", null, 500);
  }
};
