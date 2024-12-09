import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import OptionActivity from "../../models/optionActivityModel";
import axios from "axios";
import { BENZINGA_API_KEY, BENZINGA_API_URL } from "../../utils/envConstants";
import * as cron from "node-cron";
import * as moment from "moment-timezone";
import { formatExpirationDateToUTC } from "../../services/commonServices";

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
      const bulkOps = optionActivityData.map((activity: any) => ({
        updateMany: {
          filter: { id: activity.id },
          update: {
            $set: {
              ...activity,
              strike_price: activity.strike_price ? +activity.strike_price : 0,
              price: activity.price ? +activity.price : 0,
              size: activity.size ? +activity.size : 0,
              underlying_price: activity.underlying_price
                ? +activity.underlying_price
                : 0,
                date_expiration : formatExpirationDateToUTC(activity.date_expiration)
            },
          },
          upsert: true,
        },
      }));
      try {
        const result = await OptionActivity.bulkWrite(bulkOps);
      } catch (bulkWriteError) {
        console.error("Error during bulk write:", bulkWriteError);
      }
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
  // For Asia/Kolkata location
  // timezone: "Asia/Kolkata",
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
