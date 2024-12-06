import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import AdvanceFilter from "../../models/advanceFilter";

export const handleGetCommonFilters = async (req: Request, res: Response) => {
  try {
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId } = decode;

    const filter = await AdvanceFilter.findOne({ userId });
    if (!filter) {
      return responseHandler(res, true, "Filters not found", null, 404);
    }
    return responseHandler(
      res,
      true,
      "Filters fetched successfully",
      filter,
      200
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, true, "Error in getting filters", null, 500);
  }
};
