import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { findTradeWithId, formatDateStringToUTC } from "../../services/commonServices";
import { isValidObjectId } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";

import {
  formatDateTimeString,
} from "../../services/commonServices";
import { CallOrPut } from "../../utils/enum";
import Trade from "../../models/tradeModel";
export const handleUpdateManualTrade = async (req: Request, res: Response) => {
  try {
    const tradeId = req.params.id;

    if (!isValidObjectId(tradeId)) {
      return responseHandler(res, true, "Invalid trade ID format", null, 400);
    }

    const existTrade = await findTradeWithId(tradeId);
    if (!existTrade) {
      return responseHandler(res, true, "Trade not found", null, 404);
    }

    const {
      entryDate,
      entryTime,
      expirationDate,
      strike,
      price,
      riskLevel,
      callOrPut,
      size,
      type,
      ticker,
      region,
      position
    } = req.body;
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId, defaultAccountId } = decode;

    let entryDateFormat: any = "";
    if (entryDate) {
      entryDateFormat = formatDateTimeString(entryDate, entryTime, region);
    }

    let expirationDateFormat: any = "";
    if (expirationDate) {
      expirationDateFormat = formatDateStringToUTC(
        expirationDate,
        region
      );
    }

    const accountData = {
      entryDate: entryDateFormat,
      entryTime,
      expirationDate: expirationDateFormat,
      strike,
      price,
      riskLevel,
      callOrPut,
      size,
      type,
      ticker,
      accountId: defaultAccountId,
      userId,
      position,
      updatedAt: new Date()
    };0

    const updatedTrade = await Trade.findByIdAndUpdate(tradeId, accountData, {
      new: true,
    });

    return responseHandler(
      res,
      false,
      "Trade updated successfully",
      updatedTrade,
      200
    );
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in updating the manual trade.",
      null,
      500
    );
  }
};
