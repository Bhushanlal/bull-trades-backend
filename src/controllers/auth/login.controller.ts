import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import User from "../../models/usersModel";
import { findUserWithEmail } from "../../services/user.services";

const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, accessToken } = req.body;
    const user = await findUserWithEmail(email)
    if (!user) {
      return responseHandler(res, true, "User not found", null, 404);
    }
    await User.updateOne(
      { email: email, isDeleted: false },
      { token: accessToken }
    );
    res.cookie("access_token", req.body.accessToken, { httpOnly: true });
    return responseHandler(res, false, "Login successful", null, 200);
  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, true, "Error while login", null, 500);
  }
};

export default handleLogin;
