import * as Joi from "joi";
import {
  CallOrPut,
  Position,
  Provider,
  RiskLevel,
  TradeType,
} from "../../utils/enum";

export const requiredEmail = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required",
});

export const requiredUuid = Joi.string().required().messages({
  "string.empty": "Uuid cannot be empty",
  "any.required": "Uuid is required",
});

export const requiredProvider = Joi.string()
  .valid(...Object.values(Provider))
  .required()
  .messages({
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

export const requiredOtp = Joi.number()
  .integer()
  .min(1000)
  .max(9999)
  .required()
  .messages({
    "number.base": "Otp must be a number",
    "number.integer": "Otp must be an integer",
    "number.min": "Otp must be at least 4 digits",
    "number.max": "Otp must be at most 4 digits",
    "any.required": "Otp is required",
  });

export const optionalProfilePicture = Joi.string().optional().messages({
  "string.empty": "Profile Picture cannot be empty",
});

export const requiredIsFavourite = Joi.boolean().required().messages({
  "boolean.base": "IsFavourite must be a boolean",
  "any.required": "IsFavourite is required",
});

// date regex for yyyy/dd/mm
export const dateFormatRegex =
  /^\d{4}\/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])$/;
// regex for time hh:mm:ss
export const timeFormatRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
export const requireEnteryDate = Joi.string()
  .trim()
  .required()
  .pattern(dateFormatRegex)
  .messages({
    "string.base": "Entry Date must be a string",
    "string.empty": "Entry Date is required",
    "any.required": "Entry Date is required",
    "string.pattern.base": "Entry Date must be in the format yyyy/dd/mm",
  });

export const requireEnteryTime = Joi.string()
  .trim()
  .allow("")
  .required()
  .pattern(timeFormatRegex)
  .messages({
    "string.base": "Entry Time must be a string",
    "string.empty": "Entry Time is required",
    "any.required": "Entry Time is required",
    "string.pattern.base": "Entry Time must be in the format HH:MM:SS",
  });

export const requireExpireDate = Joi.string()
  .trim()
  .required()
  .pattern(dateFormatRegex)
  .messages({
    "string.base": "Expiration Date must be a string",
    "string.empty": "Expiration Date is required",
    "any.required": "Expiration Date is required",
    "string.pattern.base": "Expiration Date must be in the format yyyy/dd/mm",
  });



export const requireStrike = Joi.number().min(0).required().messages({
  "number.base": "Strike Price must be a number",
  "any.required": "Strike Price is required",
  "number.min": "Strike Price must be greater than 0",
  "number.integer": "Strike Price must be Integer",
});

export const requirePrice = Joi.number().min(0).required().messages({
  "number.base": "Price must be a number",
  "any.required": "Price time is required",
  "number.min": "Price must be greater than 0",
  "number.integer": "Price must be Integer",
});

export const requireCallOrPut = Joi.string()
  .required()
  .valid(...Object.values(CallOrPut))
  .messages({
    "string.empty": "Call/put cannot be empty",
    "any.required": "Call/put is required",
    "any.only": "Call/put must be one of the following: call or put",
  });



export const requireVolume = Joi.number().min(0).required().messages({
  "number.base": "Volume must be a number",
  "any.required": "Volume is required",
  "number.min": "Volume must be greater than 0",
  "number.integer": "Volume must be Integer",
});



export const requireTradeType = Joi.string()
  .required()
  .valid(...Object.values(TradeType))
  .messages({
    "string.empty": "Trade type cannot be empty",
    "any.required": "Trade type is required",
    "any.only": "Trade type must be one of the following: Trade",
  });

export const requireTicker = Joi.string()
  .trim()
  .min(1)
  .max(20)
  .pattern(/^(?!.*--).*$/, { name: "no consecutive hyphens" })
  .pattern(/^[A-Z0-9]+(-[A-Z0-9]+)*$/, { name: "uppercase pattern" })
  .required()
  .messages({
    "string.base": "Ticker must be a string",
    "string.min": "Ticker must be at least 1 character long",
    "string.max": "Ticker must be at most 20 characters long",
    "string.pattern.name":
      "Ticker must be 1-20 characters long, using only uppercase letters or digits, hyphens, and no consecutive hyphens.",
    "any.required": "Ticker is required",
  });

export const requireRegion = Joi.string().min(0).max(80).required().messages({
  "string.base": "Region must be a string",
  "any.required": "Region is required",
  "string.min": "Region must be at least 3 characters long",
  "string.max": "Region cannot be longer than 80 characters",
  "string.pattern.base":
    "Region cannot contain leading or trailing spaces. please enter valid Region",
});


export const requireRiskLevel = Joi.string()
  .required()
  .valid(...Object.values(RiskLevel))
  .messages({
    "string.empty": "Risk type cannot be empty",
    "any.required": "Risk type is required",
    "any.only": "Risk type must be one of the following: high, low or medium",
  });

  export const requirePosition = Joi.string()
  .required()
  .valid(...Object.values(Position))
  .messages({
    "string.empty": "Position type cannot be empty",
    "any.required": "Position type is required",
    "any.only": "Position type must be one of the following: buy or sell",
  });