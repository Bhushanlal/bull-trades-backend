import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import {
  requireAskPrice,
  requireBidPrice,
  requireCallOrPut,
  requiredIsFavourite,
  requireEnteryDate,
  requireEnteryTime,
  requireExecutionPrice,
  requireExpireDate,
  requireExpireTime,
  requireOpenInterest,
  requirePrem,
  requireRegion,
  requireSentiment,
  requireSpot,
  requireStrike,
  requireTicker,
  requireTradeType,
  requireVolume,
} from "./commonSchema";
import * as Joi from "joi";
import { decodeDetails } from "../../services/user.services";

const tradeSchema = Joi.object({
  isFavourite: requiredIsFavourite,
  entryDate: requireEnteryDate,
  entryTime: requireEnteryTime,
  expirationDate: requireExpireDate,
  expirationTime: requireExpireTime,
  strike: requireStrike,
  spot: requireSpot,
  callOrPut: requireCallOrPut,
  bidPrice: requireBidPrice,
  askPrice: requireAskPrice,
  sentiment: requireSentiment,
  execution: requireExecutionPrice,
  openInterest: requireOpenInterest,
  volume: requireVolume,
  prem: requirePrem,
  type: requireTradeType,
  ticker: requireTicker,
  region : requireRegion
});

// Validation middleware
export const manualTradeValidate = (req: Request, res: Response, next: any) => {
  const { error } = tradeSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return responseHandler(res, true, errorMessage, null, 400);
  }

  next();
};
