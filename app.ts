import * as express from "express";
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import * as dotenv from "dotenv";
import connectToMongoDB from "./src/utils/db";
import routes from "./src/routes";
import * as cors from 'cors';
import { initializeBenzingaCron } from "./src/controllers/optionActivity/benzingaActivity.controller";

export const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  origin: process.env.CORS_ORIGIN, // Replace with your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

connectToMongoDB();

app.use("/api", routes);

// Initialize cron jobs
// initializeBenzingaCron();

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Express is listening at http://localhost:${PORT}`);
});
