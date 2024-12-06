import * as dotenv from "dotenv";
dotenv.config();
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const SMTP_EMAIL = process.env.SMTP_EMAIL;
export const SMTP_FROM = process.env.SMTP_FROM;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BENZINGA_API_KEY = process.env.BENZINGA_API_KEY;
export const BENZINGA_API_URL = process.env.BENZINGA_API_URL;
export const AWS_REGION = process.env.AWS_REGION
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
