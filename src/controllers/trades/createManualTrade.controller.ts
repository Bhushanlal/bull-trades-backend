import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { decodeDetails } from "../../services/user.services";
import { JwtPayload } from "jsonwebtoken";
import * as moment from "moment";
import {
  formatDateStringToUTC,
  formatDateTimeString,
} from "../../services/commonServices";
import Trade from "../../models/tradeModel";

export const handleManualTrade = async (req: Request, res: Response) => {
  try {
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

    // format entery date  and time
    let entryDateFormat: any = "";
    if (entryDate) {
      entryDateFormat = formatDateTimeString(entryDate, entryTime, region);
    }

    // format enxpiration time and date
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
      position
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
