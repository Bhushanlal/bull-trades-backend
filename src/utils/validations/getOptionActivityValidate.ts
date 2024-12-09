import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import * as Joi from "joi";
import {
  optionalCallOrPut,
  optionalExpirationEnd,
  optionalExpirationStart,
  optionalOtmCallString,
  optionalOtmPutString,
  optionalPriceEndString,
  optionalPriceLtString,
  optionalPriceStartString,
  optionalSentiment,
  optionalSizeGrt500,
  optionalTicker,
  querySchemaPage,
} from "./commonSchema";

const getOptionActivitySchema = Joi.object({
  page: querySchemaPage,
  otmCalls: optionalOtmCallString,
  otmPuts: optionalOtmPutString,
  priceLessThanTwo: optionalPriceLtString,
  sizeGreater500: optionalSizeGrt500,
  sentiment: optionalSentiment,
  callOrPut: optionalCallOrPut,
  priceStart: optionalPriceStartString,
  priceEnd: optionalPriceEndString,
  expirationStart: optionalExpirationStart,
  expirationEnd: optionalExpirationEnd,
  ticker: optionalTicker,
});

// Validation middleware
export const getOptionActivityValidate = (
  req: Request,
  res: Response,
  next: any
) => {
  const { error } = getOptionActivitySchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return responseHandler(res, true, errorMessage, null, 400);
  }
  const { priceEnd, priceStart } = req.body;
  if (priceEnd && priceStart && +priceStart > +priceEnd) {
    return responseHandler(
      res,
      true,
      "Price start cannot be greater than the price end",
      null,
      400
    );
  }
  next();
};
