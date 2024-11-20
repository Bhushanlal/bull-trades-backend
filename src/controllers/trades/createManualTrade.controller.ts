import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { decodeDetails } from "../../services/user.services";
import { JwtPayload } from "jsonwebtoken";
import * as moment from "moment";
import {
  convertToUTC,
  formatDateTimeString,
} from "../../services/commonServices";
import { CallOrPut } from "../../utils/enum";
import Trade from "../../models/tradeModel";

// Payload
// {
//     "isFavourite" : false,
//     "entryDate" : "2024/18/12",
//     "entryTime" : "14:25:00",
//     "expirationDate" : "2024/18/12",
//     "expirationTime" : "14:25:00",
//     "strike" : 15.00,
//     "spot" : 14.00,
//     "callOrPut" : "call",
//     "bidPrice" : 148,
//     "askPrice" : 150,
//     "sentiment" : "bearish",
//     "execution" : 1450,
//     "openInterest" : 1450,
//     "volume" : 25,
//     "prem" : 145,
//     "type" : "trade",
//     "ticker" : "AACL",
//     "region": "Test"

// }
export const handleManualTrade = async (req: Request, res: Response) => {
  try {
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

    // format entery date  and time
    let entryDateFormat: any = "";
    if (entryDate) {
      entryDateFormat = formatDateTimeString(entryDate, entryTime, region);
    }

    // format enxpiration time and date
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
    console.log(expirationDateMoment, "expirationDateMoment");

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
    };
    const newAccount = new Trade(accountData);
    await newAccount.save();

    return responseHandler(
      res,
      false,
      "Manual trade added successfully",
      null,
      201
    );
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in creating the manual trade.",
      null,
      500
    );
  }
};
