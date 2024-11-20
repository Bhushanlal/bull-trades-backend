import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { findTradeWithId } from "../../services/commonServices";
import { isValidObjectId } from "mongoose";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import * as moment from "moment";

import {
  convertToUTC,
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
      isFavourite,
      entryDate,
      entryTime,
      expirationDate,
      expirationTime,
      strike,
      spot,
      callOrPut,
      bidPrice,
      askPrice,
      sentiment,
      execution,
      openInterest,
      volume,
      prem,
      type,
      ticker,
      region,
    } = req.body;
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId, defaultAccountId } = decode;

    let entryDateFormat: any = "";
    if (entryDate) {
      entryDateFormat = formatDateTimeString(entryDate, entryTime, region);
    }

    let expirationDateFormat: any = "";
    if (expirationDate) {
      expirationDateFormat = formatDateTimeString(
        expirationDate,
        expirationTime,
        region
      );
    }
    const details = `${bidPrice}@${askPrice}`;
    let moneyNess = 0;
    if (callOrPut === CallOrPut.CALL) {
      const calculate = spot / strike;
      moneyNess = calculate || 0;
    } else {
      const calculate = strike / spot;
      moneyNess = calculate || 0;
    }
    const currentDate = moment();
    const expirationDateMoment = moment(expirationDateFormat);

    const datesToExpire = expirationDateMoment.diff(currentDate, "days");

    const accountData = {
      isFavourite,
      entryDate: entryDateFormat,
      entryTime,
      expirationDate: expirationDateFormat,
      expirationTime,
      strike,
      spot,
      callOrPut,
      details,
      sentiment,
      execution,
      moneyNess,
      openInterest,
      volume,
      prem,
      type,
      ticker,
      accountId: defaultAccountId,
      userId,
      datesToExpire: datesToExpire || 0,
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
