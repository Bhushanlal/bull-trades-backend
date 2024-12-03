import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import Trade from "../../models/tradeModel";
import { formatDateStringToUTC } from "../../services/commonServices";

export const handleGetTrades = async (req: Request, res: Response) => {
  try {
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId, defaultAccountId } = decode;

    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    const {
      sizeGrt500,
      callOrPut,
      riskLevel,
      priceStart,
      priceEnd,
      expirationStart,
      expirationEnd,
      region,
      ticker
    } = req.query;

    if (priceEnd && (priceStart > priceEnd)) {
      return responseHandler(
        res,
        true,
        "PriceStart must be smaller than PriceEnd",
        null,
        400
      );
    }

    // Format expiration dates based on region
    let expirationStartFormatted: any = "";
    let expirationEndFormatted: any = "";
    if (expirationStart) {
      expirationStartFormatted = formatDateStringToUTC(expirationStart, region);
    }
    if (expirationEnd) {
      expirationEndFormatted = formatDateStringToUTC(expirationEnd, region);
    }

    // Build query object for filtering
    const query: any = {
      userId,
      accountId: defaultAccountId,
      isDeleted: false,
    };

    // Apply filters
    if (callOrPut) {
      query.callOrPut = callOrPut;
    }
    if (ticker) {
      query.ticker = { $regex: ticker, $options: 'i' };
    }
    if (sizeGrt500 == "true") {
      query.size = { $gt: 500 };
    }
    if (riskLevel) {
      query.riskLevel = riskLevel;
    }
    if (priceStart) {
      query.price = { $gte: priceStart }; 
    }
    if (priceEnd) {
      query.price = { ...query.price, $lte: priceEnd }; 
    }

    
    if (expirationStartFormatted) {
      query.expirationDate = {
        ...query.expirationDate,
        $gte: expirationStartFormatted,
      }; 
    }
    if (expirationEndFormatted) {
      query.expirationDate = {
        ...query.expirationDate,
        $lte: expirationEndFormatted,
      }; 
    }
    // Get total count for pagination
    const totalTrades = await Trade.countDocuments(query);
    const trades = await Trade.find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    return responseHandler(
      res,
      false,
      "Trades fetched successfully",
      {
        trades,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalTrades / limit),
          totalItems: totalTrades,
          itemsPerPage: limit,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in getting user trades.",
      null,
      500
    );
  }
};
