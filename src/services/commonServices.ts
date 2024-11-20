import * as momentTZ from "moment-timezone";
import * as moment from "moment"
import Trade from "../models/tradeModel";
export function convertToUTC(dateTime: any, fromTimezone: any) {
    try {
      // Validate timezone
      if (!momentTZ.tz.zone(fromTimezone)) {
        throw new Error(`Invalid timezone: ${fromTimezone}`);
      }
      // Create momentTZ object in the source timezone
      const timeInZone = momentTZ.tz(dateTime, fromTimezone);
      // Convert to different UTC formats
      return timeInZone.utc().format(); // Full ISO format
    } catch (error) {
      console.error("Error converting timezone:", error);
      return null;
    }
  }

  export const formatDateTimeString = (date : any , time : any, region: string) =>{
    const dateMoment = moment(date, "YYYY/DD/MM").local();
      const datetimeMoment = dateMoment
        .set({
          hour: time?.split(":")[0],
          minute: time?.split(":")[1],
          second: time?.split(":")[2],
        })
        .format("YYYY-MM-DDTHH:mm:ss");
      const entryUTCDate = convertToUTC(datetimeMoment, region || "UTC");
      return entryUTCDate;
  }


  export const findTradeWithId = async (tradeId: string) => {
    const user = await Trade.findOne({ _id:tradeId });
    return user ? user : null;
  };