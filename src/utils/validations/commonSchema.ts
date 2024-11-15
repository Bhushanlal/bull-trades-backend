import * as Joi from "joi";
import { Provider } from "../../utils/enum";

export const requiredEmail = Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  });

export const requiredUuid = Joi.string().required().messages({
    "string.empty": "Uuid cannot be empty",
    "any.required": "Uuid is required",
  });

export const requiredProvider = Joi.string().valid(...Object.values(Provider)).required().messages({
    "string.empty": "Provider cannot be empty",
    "any.required": "Provider is required",
    "any.only": "Provider must be one of the following: EMAIL, GOOGLE",
  });

export const requiredFullname = Joi.string().min(3).required().messages({
    "string.min": "Fullname must be at least 3 characters long",
    "string.empty": "Fullname cannot be empty",
    "any.required": "Fullname is required",
  });

export const requiredAccessToken = Joi.string().required().messages({
    "string.empty": "AccessToken cannot be empty",
    "any.required": "AccessToken is required",
  });
  
export const requiredOtp = Joi.number().integer().min(1000).max(9999).required().messages({
    "number.base": "Otp must be a number",
    "number.integer": "Otp must be an integer",
    "number.min": "Otp must be at least 4 digits",
    "number.max": "Otp must be at most 4 digits",
    "any.required": "Otp is required",
  });

export const optionalProfilePicture = Joi.string().optional().messages({
    "string.empty": "Profile Picture cannot be empty",
  });