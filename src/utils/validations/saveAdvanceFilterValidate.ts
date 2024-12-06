import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import * as Joi from "joi";
import {
  optionalSizeGrtBoolean,
  optionalCallOrPut,
  optionalPriceStart,
  optionalPriceEnd,
  optionalExpirationStart,
  optionalExpirationEnd,
  optionalRegion,
  optionalOtmCallBoolean,
  optionalOtmPutBoolean,
  optionalPriceLtBoolean,
  optionalSentiment,
} from "./commonSchema";

const advanceFilterSchema = Joi.object({
  otmCalls: optionalOtmCallBoolean,
  otmPuts: optionalOtmPutBoolean,
  priceLessThanTwo: optionalPriceLtBoolean,
  sizeGreater500: optionalSizeGrtBoolean,
  sentiment: optionalSentiment,
  callOrPut: optionalCallOrPut,
  priceStart: optionalPriceStart,
  priceEnd: optionalPriceEnd,
  expirationStart: optionalExpirationStart,
  expirationEnd: optionalExpirationEnd,
  region: optionalRegion,
});

// Validation middleware
export const advanceFilterValidate = (
  req: Request,
  res: Response,
  next: any
) => {
  const { error } = advanceFilterSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return responseHandler(res, true, errorMessage, null, 400);
  }
  const { priceEnd, priceStart } = req.body;
  if (priceEnd && priceStart && priceStart > priceEnd) {
    return responseHandler(
      res,
      true,
      "Price start can not be greater than the price end",
      null,
      400
    );
  }
  next();
};
