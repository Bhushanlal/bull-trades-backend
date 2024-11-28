import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import {
  formatDateStringToUTC,
  formatDateTimeString,
  parseCSV,
  parseExcel,
  safeDeleteFile,
} from "../../services/commonServices";
import { manualTradeValidate } from "../../utils/validations/manualTradeValidate";
import { validateSingleTrade } from "../../utils/validations/uploadTradeValidate";
import Trade from "../../models/tradeModel";
import * as moment from "moment";

export const handleUploadTrades = async (req: Request, res: Response) => {
  let path: string | null = null;
  try {
    const { region } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .send({ error: true, message: "Please upload a file!" });
    }
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId, defaultAccountId } = decode;
    let tradesData: any = [];
    path = `./public/uploads/${req.file.filename}`;

    if (req.file.mimetype === "text/csv") {
      tradesData = await parseCSV(path);
    } else if (
      req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      req.file.mimetype === "application/vnd.ms-excel"
    ) {
      tradesData = parseExcel(path);
    } else {
      return responseHandler(res, true, "Unsupported file format!", null, 400);
    }

    if (tradesData.length === 0) {
      return responseHandler(res, true, "No records found in file.", null, 400);
    }

    // Validate each trade record
    const newTrades = [];
    const validationErrors: string[] = [];
    for (const trade of tradesData) {
      const errors = validateSingleTrade(trade);
      if (errors.length > 0) {
        validationErrors.push(...errors);
        break;
      }

      let entryDate: any = trade.entryDate;
      let expirationDate: any = trade.expirationDate;
      if (
        !moment(expirationDate, "YYYY/DD/MM").isAfter(
          moment(entryDate, "YYYY/DD/MM")
        )
      ) {
        validationErrors.push(
          "Expiration date cannot be greater than the entry date."
        );
        break; 
      }
      let entryDateFormat: any = "";
      if (entryDate) {
        entryDateFormat = formatDateTimeString(
          entryDate,
          trade.entryTime,
          region
        );
      }

      // format enxpiration time and date
      let expirationDateFormat: any = "";
      if (expirationDate) {
        expirationDateFormat = formatDateStringToUTC(
          expirationDate,
          region
        );
      }
      const validTradeData = {
        ...trade,
        entryDate: entryDateFormat,
        expirationDate: expirationDateFormat,
        accountId: defaultAccountId,
        userId,
      };
      newTrades.push(validTradeData);
    }

    if (validationErrors.length > 0) {
      safeDeleteFile(path);
      return responseHandler(res, true, validationErrors.join("; "), null, 400);
    }

    if (newTrades.length) {
      await Trade.insertMany(newTrades);
      safeDeleteFile(path);
      return responseHandler(
        res,
        false,
        "Trades imported successfully.",
        null,
        200
      );
    }
  } catch (error) {
    console.error(error, "error");
    return responseHandler(res, true, "Error in uploading trades.", null, 500);
  }
};
