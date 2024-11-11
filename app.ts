import * as express from "express";
import * as bodyParser from 'body-parser';
const app = express();
import * as dotenv from "dotenv";
import mongoose from 'mongoose';
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with error handling
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

connectToMongoDB();

app.listen(process.env.PORT, () => {
  console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
