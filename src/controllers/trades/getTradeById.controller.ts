
import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { findTradeWithId } from "../../services/commonServices";
import { isValidObjectId } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export const handleGetTrade = async (req: Request, res: Response) => {
    try {
      const tradeId = req.params.id;
  
      if (!isValidObjectId(tradeId)) {
        return responseHandler(res, true, "Invalid trade ID format", null, 400);
      }
  
      const existTrade = await findTradeWithId(tradeId);
      if (!existTrade) {
        return responseHandler(res, true, "Trade not found", null, 404);
      }


      return responseHandler(
        res,
        false,
        "Trade fetched successfully",
        existTrade,
        200
      );
    } catch (error) {
        console.error(error);
        return responseHandler(
          res,
          true,
          "Error in getting trade.",
          null,
          500
        );
      }
    };
    