import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import { optionalProfilePicture, requiredAccessToken, requiredEmail, requiredFullname, requiredProvider, requiredUuid } from "./commonSchema";
import * as Joi from "joi"

const userSchema = Joi.object({
    email: requiredEmail,
    uuid : requiredUuid,
    provider : requiredProvider,
    fullname: requiredFullname,
    accessToken : requiredAccessToken,
    profilePicture: optionalProfilePicture
  });

// Validation middleware
export const registerValidate = (req: Request, res: Response, next: any) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return responseHandler(res, true, errorMessage, null, 400);
    }
  
    next();
  };