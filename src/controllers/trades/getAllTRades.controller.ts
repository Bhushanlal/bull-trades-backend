import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import Trade from "../../models/tradeModel";

export const handleGetTrades = async (req: Request, res: Response) => {
  try {
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId, defaultAccountId } = decode;

    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalTrades = await Trade.countDocuments({
      userId,
      accountId: defaultAccountId,
    });

    // Get trades with pagination
    const trades = await Trade.find({
      userId,
      accountId: defaultAccountId,
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    return responseHandler(res, false, "Trades fetched successfully", {
      trades,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalTrades / limit),
        totalItems: totalTrades,
        itemsPerPage: limit,
      },
    }, 200);
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
