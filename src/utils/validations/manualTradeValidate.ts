import { Request, Response } from "express";
import { responseHandler } from "../responseHandler";
import {
  requirePrice,
  requireCallOrPut,
  requireEnteryDate,
  requireEnteryTime,
  requireExpireDate,
  requireRegion,
  requireStrike,
  requireTicker,
  requireTradeType,
  requireVolume,
  requireRiskLevel,
  requirePosition,
} from "./commonSchema";
import * as Joi from "joi";
import { decodeDetails } from "../../services/user.services";

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
  region : requireRegion,
  riskLevel : requireRiskLevel,
  position : requirePosition
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
