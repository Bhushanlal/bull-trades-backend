import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import OptionActivity from "../../models/optionActivityModel";
import { formatDateStringToUTC } from "../../services/commonServices";

export const handleGetOptionActivity = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters from query
    let page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50 ;

    // Extract filter parameters
    const {
      ticker,
      otmCalls,
      otmPuts,
      priceLessThanTwo,
      sizeGreater500,
      sentiment,
      callOrPut,
      priceStart,
      priceEnd,
      expirationStart,
      expirationEnd,
    } = req.query;

    // Build query object for filtering
    const query: any = {};

    // Apply ticker filter if provided
    if (ticker) {
      page = 1;
      query.ticker = { $regex: ticker, $options: "i" };
    }

    // OTM Calls filter
    if (otmCalls === "true") {
      query.$expr = { $gt: ["$strike_price", "$underlying_price"] };
    }

    // OTM Puts filter
    if (otmPuts === "true") {
      query.$expr = { $lt: ["$strike_price", "$underlying_price"] };
    }

    // Price less than $2 filter
    if (priceLessThanTwo === "true") {
      if (!query.price) {
        query.price = {};
      }
      query.price = { $lt: 2 };
    }

    // Size greater than 500 filter
    if (sizeGreater500 === "true") {
      query.size = { $gt: 500 };
    }

    // Sentiment filter
    if (sentiment && sentiment !== "null") {
      query.sentiment = sentiment;
    }

    // Call or Put filter
    if (callOrPut && callOrPut !== "null") {
      query.put_call = callOrPut === "put" ? "PUT" : "CALL";
    }


    if (priceStart && priceStart !== "null") {
      if (!query.price) {
        query.price = {};
      }
      query.price.$gte = +(priceStart as string);
    }
    if (priceEnd && priceEnd !== "null") {
      if (!query.price) {
        query.price = {};
      }
      query.price.$lte = +(priceEnd as string);
    }

    // Expiration date range filters
    if (expirationStart || expirationEnd) {
      query.date_expiration = {};
      if (expirationStart) {
        query.date_expiration.$gte = formatDateStringToUTC(
          expirationStart as string
        );
      }
      if (expirationEnd) {
        query.date_expiration.$lte = formatDateStringToUTC(
          expirationEnd as string
        );
      }
    }
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalActivities = await OptionActivity.countDocuments(query);
    const activities = await OptionActivity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return responseHandler(
      res,
      false,
      "Option activities fetched successfully",
      {
        activities,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalActivities / limit),
          totalItems: totalActivities,
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
      "Error in getting option activities.",
      null,
      500
    );
  }
};
