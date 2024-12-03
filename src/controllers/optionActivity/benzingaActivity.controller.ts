import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import OptionActivity from "../../models/optionActivityModel";
import axios from "axios";
import { BENZINGA_API_KEY, BENZINGA_API_URL } from "../../utils/envConstants";

export const handleBenzingaOptionActivity = async (
  req: Request,
  res: Response
) => {
  try {
    const pageSize = 1000;
    const benzingaResponse = await axios.get(
      `${BENZINGA_API_URL}/signal/option_activity?token=${BENZINGA_API_KEY}&pagesize=${pageSize}`
    );
    const optionActivityData = benzingaResponse.data.option_activity;
    if (optionActivityData && optionActivityData.length > 0) {
      const bulkOps = optionActivityData.map((activity) => ({
        updateMany: {
          filter: { id: activity.id },
          update: { $set: activity },
          upsert: true,
        },
      }));

      await OptionActivity.bulkWrite(bulkOps);
    }

    return responseHandler(res, false, "Records saved successfully", null, 200);
  } catch (error) {
    console.error("Benzinga webhook error:", error);
    return responseHandler(res, false, "Error in saving records", null, 500);
  }
};
