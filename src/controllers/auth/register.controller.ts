import { Request, Response } from "express";
import User from "../../models/usersModel";
import { dataFormatForLocalStorage, encodeDetails, findUserWithEmail } from "../../services/user.services";
import { Provider } from "../../utils/enum";
import { responseHandler } from "../../utils/responseHandler";
import Account from "../../models/accountModel";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, uuid, provider, fullname, accessToken, profilePicture } =
      req.body;
    const user = await findUserWithEmail(email);

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
        const dateToBeEncoded = {
          userId : user._id,
          defaultAccountId: user.defaultAccount
        }
        const userDetails = dataFormatForLocalStorage(user);
        const encodeDefaultId = encodeDetails(dateToBeEncoded)
        res.cookie("access_token", req.body.accessToken, { httpOnly: true });
        res.cookie("user_detail", encodeDefaultId, { httpOnly: true });
        return responseHandler(res, false, "Login successful", userDetails, 200);
      }
    }

    // Create new user
    const newUser = await User.create({
      email,
      uuid,
      provider,
      fullname,
      token: accessToken,
      isVerified :provider === Provider .GOOGLE ? true: false ,
      profilePicture: profilePicture ? profilePicture : null,
    });
    // Create new account
    const newAccount = await Account.create({
      name: `main-${newUser._id}`
    });
    // Update user's default account
    await User.updateOne(
      { _id: newUser._id },
      { defaultAccount: newAccount._id }
    );
    if (provider === Provider .GOOGLE) {
      const dateToBeEncoded = {
        userId : newUser._id,
        defaultAccountId: newAccount._id
      }
      const encodeDefaultId = encodeDetails(dateToBeEncoded)
      res.cookie("access_token", req.body.accessToken, { httpOnly: true });
      res.cookie("user_detail", encodeDefaultId, { httpOnly: true });
    }
      
    const userDetails = dataFormatForLocalStorage(newUser);
    return responseHandler(
      res,
      false,
      "User registered successfully",
      userDetails,
      201
    );
  } catch (error) {
    console.error("Login error:", error);
    return responseHandler(res, true, "Error while registering", null, 500);
  }
};
