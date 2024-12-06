import * as momentTZ from "moment-timezone";
import * as moment from "moment";
import Trade from "../models/tradeModel";
import { createReadStream } from "fs";
import * as XLSX from "xlsx";
import { parse } from "fast-csv";
import * as fs from "fs";
import * as path from "path";
import s3 from "../utils/awsS3Config";
import { Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import { AWS_BUCKET_NAME, AWS_REGION } from "../utils/envConstants";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

export const formatDateTimeString = (date: any, time: any, region: string) => {
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
};

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
    console.log(error, "error");
  }
};

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

export const getPresignedUrl = async (newFileKey: string) => {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: newFileKey, // The same key used for upload
    }),
    { expiresIn: 36000 }
  );
};

export const uploadFileToS3 = async (
  file: Express.Multer.File,
  userId: string
): Promise<string | null> => {
  const filePath = path.join(`./${file.path}`); // Get the file path
  const fileContent = fs.readFileSync(filePath); // Read the file content

  const folderPath = `profiles/${userId}`;
  const newFileKey = `${folderPath}/${file.filename}`;

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: newFileKey,
    Body: fileContent,
    ContentType: file.mimetype,
    // ACL: 'public-read',
  };

  try {
    // Upload the new file to S3
    const uploadCommand = new PutObjectCommand(params);
    const uploadResult = await s3.send(uploadCommand);

    // Delete the file from the local project directory
    fs.unlinkSync(filePath);

    return newFileKey;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
};

export const deleteS3Imgs = async (imgs: string) => {
  // Helper function to find the previous file key for the user
  const findPreviousFileKey = async (imgs: string): Promise<string | null> => {
    const imgDomain = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com`;
    const previousFileKey = imgs.replace(imgDomain, "");
    if (previousFileKey) {
      return previousFileKey;
    }
    return null;
  };

  // Delete the previous image of the same user if it exists
  const previousFileKey = await findPreviousFileKey(imgs);

  if (previousFileKey) {
    const deleteParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: previousFileKey,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));
  }
};
