import { Request, Response } from "express";
import User from "../../models/usersModel";
import { Provider } from "../../utils/enum";
import { responseHandler } from "../../utils/responseHandler";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, uuid, provider, fullname, accessToken, profilePicture } =
      req.body;
    const user = await User.findOne({ email, isDeleted: false });

    if (provider === Provider.EMAIL) {
      if (user) {
        return responseHandler(res, true, "User already exists", null, 400);
      }
    }
    if (provider === Provider.GOOGLE) {
      if (user) {
        await User.updateOne(
          { email: email, isDeleted: false },
          { token: accessToken }
        );
        res.cookie("access_token", req.body.accessToken, { httpOnly: true });
        return responseHandler(res, false, "Login successful", null, 200);
      }
    }

    // Create new user
    const newUser = await User.create({
      email,
      uuid,
      provider,
      fullname,
      token: accessToken,
      profilePicture: profilePicture ? profilePicture : null,
    });
    // set the cookie for user token
    res.cookie("access_token", "accessToken Test", { httpOnly: true });
    return responseHandler(
      res,
      false,
      "User registered successfully",
      newUser,
      201
    );
  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, true, "Error while registering", null, 500);
  }
};
