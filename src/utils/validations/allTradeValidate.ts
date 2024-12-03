import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import * as Joi from "joi";
import {
  optionalSizeGrt500,
  optionalCallOrPut,
  optionalRiskLevel,
  optionalPriceStart,
  optionalPriceEnd,
  optionalExpirationStart,
  optionalExpirationEnd,
  optionalRegion,
  optionalTicker,
  querySchemaPage,
} from "./commonSchema";

const tradeQuerySchema = Joi.object({
  sizeGrt500: optionalSizeGrt500,
  callOrPut: optionalCallOrPut,
  riskLevel: optionalRiskLevel,
  priceStart: optionalPriceStart,
  priceEnd: optionalPriceEnd,
  expirationStart: optionalExpirationStart,
  expirationEnd: optionalExpirationEnd,
  region: optionalRegion,
  ticker: optionalTicker,
  page: querySchemaPage
});

// Validation middleware
export const allTradeValidate = (req: Request, res: Response, next: any) => {
  const { error } = tradeQuerySchema.validate(req.query, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return responseHandler(res, true, errorMessage, null, 400);
  }

  next();
};
