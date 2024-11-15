import * as dotenv from "dotenv";
dotenv.config();
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
export const SMTP_EMAIL = process.env.SMTP_EMAIL;
export const SMTP_FROM = process.env.SMTP_FROM;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
export const FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY