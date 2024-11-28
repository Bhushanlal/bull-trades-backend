import * as momentTZ from "moment-timezone";
import * as moment from "moment"
import Trade from "../models/tradeModel";
import { createReadStream } from "fs";
import * as XLSX from "xlsx";
import { parse } from "fast-csv";
import * as fs from "fs";

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

  // New function to convert date to UTC at the start of the day
  export const formatDateStringToUTC = (date: any, region: any) => {
    try {
      const dateMoment = moment(date, "YYYY/DD/MM").local();
      const datetimeMoment = dateMoment
        .set({ hour: 0, minute: 0, second: 0 }) // Set to start of the day
        .format("YYYY-MM-DDTHH:mm:ss");
      const entryUTCDate = convertToUTC(datetimeMoment, region || "UTC");
      
      return entryUTCDate;
    } catch (error) {
     console.log(error, 'error');
      
    }
  }

  export const findTradeWithId = async (tradeId: string) => {
    const user = await Trade.findOne({ _id: tradeId, isDeleted: false });
    return user ? user : null;
  };


  export const parseCSV = (path: string) => {
    return new Promise((resolve, reject) => {
      const rows = [];
      createReadStream(path)
        .pipe(parse({ headers: true }))
        .on("data", (row) => rows.push(row))
        .on("end", () => resolve(rows))
        .on("error", (error) => reject(error));
    });
  };

  export const parseExcel = (path: string) => {
    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  };

  export const safeDeleteFile = async (filePath: string) => {
    try {
      if (filePath && fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      } else {
        console.log("File does not exist:", filePath);
      }
    } catch (err) {
      console.error("Error during file deletion:", err);
    }
  };