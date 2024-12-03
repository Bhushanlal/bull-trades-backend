import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import OptionActivity from "../../models/optionActivityModel";

export const handleGetOptionActivity = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    const { ticker } = req.query;

    // Build query object for filtering
    const query: any = {};

    // Apply ticker filter if provided
    if (ticker) {
      query.ticker = { $regex: ticker, $options: 'i' };
    }

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