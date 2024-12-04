import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import { optionalFullname, optionalGender, optionalPhoneNumber, optionalProfilePicture } from "./commonSchema";
import * as Joi from "joi"

const userProfileSchema = Joi.object({
    fullname: optionalFullname,
    phoneNumber : optionalPhoneNumber,
    profilePicture: optionalProfilePicture,
    gender: optionalGender,
  });

// Validation middleware
export const updateUserProfileValidate = (req: Request, res: Response, next: any) => {
    const { error } = userProfileSchema.validate(req.body, { abortEarly: false });
  
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return responseHandler(res, true, errorMessage, null, 400);
    }
  
    next();
  };