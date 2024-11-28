import {
  requireEnteryTime,
  requireCallOrPut,
  requireStrike,
  requirePosition,
  requireRegion,
  requireTicker,
  requirePrice,
  requireVolume,
  requireTradeType,
  requireRiskLevel,
} from "./commonSchema";

import { requireExpireDate } from "./commonSchema";

import * as Joi from "joi";
import { requireEnteryDate } from "./commonSchema";

export const validateSingleTrade = (trade: any): string[] => {
  const tradeSchema = Joi.object({
    entryDate: requireEnteryDate,
    entryTime: requireEnteryTime,
    expirationDate: requireExpireDate,
    strike: requireStrike,
    price: requirePrice,
    callOrPut: requireCallOrPut,
    size: requireVolume,
    type: requireTradeType,
    ticker: requireTicker,
    riskLevel: requireRiskLevel,
    position: requirePosition,
  });
  const { error } = tradeSchema.validate(trade, { abortEarly: false });
  if (error) {
    return error.details.map((detail) => detail.message);
  }
  return [];
};
