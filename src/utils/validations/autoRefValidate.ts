import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import * as Joi from "joi";
import { requiredAutRefColName, requiredAutoRefValue } from "./commonSchema";

const autorefSchema = Joi.object({
  autoRefColName: requiredAutRefColName,
  autoRefValue: requiredAutoRefValue,
});

// Validation middleware
export const autorefValidate = (req: Request, res: Response, next: any) => {
  const { error } = autorefSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return responseHandler(res, true, errorMessage, null, 400);
  }

  next();
};
