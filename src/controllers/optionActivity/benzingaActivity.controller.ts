import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import OptionActivity from "../../models/optionActivityModel";
import axios from "axios";
import { BENZINGA_API_KEY, BENZINGA_API_URL } from "../../utils/envConstants";
import * as cron from "node-cron";
import * as moment from "moment-timezone";

// Function to fetch and save Benzinga data
const fetchBenzingaOptionActivity = async () => {
  try {
    console.log("inside the cron");

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
      console.log(
        `Successfully updated ${optionActivityData.length} records at ${moment()
          .tz("America/New_York")
          .format("YYYY-MM-DD HH:mm:ss")}`
      );
    }
  } catch (error) {
    console.error("Benzinga API error:", error);
  }
};

// HTTP endpoint handler (for manual triggers)
export const handleBenzingaOptionActivity = async (
  req: Request,
  res: Response
) => {
  try {
    await fetchBenzingaOptionActivity();
    return responseHandler(res, false, "Records saved successfully", null, 200);
  } catch (error) {
    console.error("Benzinga webhook error:", error);
    return responseHandler(res, false, "Error in saving records", null, 500);
  }
};

// Initialize cron jobs
export const initializeBenzingaCron = () => {
  cron.schedule(
    "*/10 * 9-16 * * *",
    async () => {
      const now = new Date();

      // Convert to numbers for comparison
      const hours = parseInt(
        now.toLocaleString("en-US", {
          timeZone: "America/New_York",
          hour: "numeric",
          hour12: false,
        }),
        10
      );
      const minutes = parseInt(
        now.toLocaleString("en-US", {
          timeZone: "America/New_York",
          minute: "numeric",
          hour12: false,
        }),
        10
      );

      // Stop the task at 16:30
      if (hours === 16 && minutes >= 30) {
        return;
      }
      await fetchBenzingaOptionActivity();
    },
    {
      timezone: "America/New_York",
    }
  );
};
