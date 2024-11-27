import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import Trade from "../../models/tradeModel";
import { isValidObjectId } from "mongoose";
import { findTradeWithId } from "../../services/commonServices";

export const handleDeleteTrades = async (req: Request, res: Response) => {
  try {
    //---------------Bulk delete code starts here -----------
    // const { deletedIds } = req.body;
    // if (!deletedIds.length) {
    //   return responseHandler(
    //     res,
    //     true,
    //     "Empty deleted id's array not allowed.",
    //     null,
    //     400
    //   );
    // }

    // const validIds = deletedIds.filter((id: string) => isValidObjectId(id));

    // if (validIds.length === 0) {
    //   return responseHandler(
    //     res,
    //     true,
    //     "All trade id's are invalid.",
    //     null,
    //     400
    //   );
    // }

    // const currentDate = new Date();
    // const updateResult = await Trade.updateMany(
    //   { _id: { $in: validIds } },
    //   { isDeleted: true, deletedAt: currentDate }
    // );
    
    // if (updateResult.modifiedCount < deletedIds.length) {
    //   return responseHandler(
    //     res,
    //     true,
    //     "Deleted existed trades, few of them were not existed.",
    //     null,
    //     200
    //   );
    // } else {
    //   return responseHandler(
    //     res,
    //     false,
    //     "Trades deleted successfully.",
    //     null,
    //     200
    //   );
    // }
    //---------------Bulk delete code ends here -----------
    const tradeId = req.params.id;

    if (!isValidObjectId(tradeId)) {
      return responseHandler(res, true, "Invalid trade ID format", null, 400);
    }

    const existTrade = await findTradeWithId(tradeId);
    if (!existTrade) {
      return responseHandler(res, true, "Trade not found", null, 404);
    }

    // Update the trade to set isDeleted and deletedAt
    const currentDate = new Date();
    await Trade.updateOne(
      { _id: tradeId },
      { isDeleted: true, deletedAt: currentDate }
    );

    return responseHandler(
      res,
      false,
      "Trade deleted successfully.",
      null,
      200
    );

  } catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in updating trades.",
      null,
      500
    );
  }
};
