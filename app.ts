import * as express from "express";
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
const app = express();
import * as dotenv from "dotenv";
import connectToMongoDB from "./src/utils/db";
import routes from "./src/routes";
import * as cors from 'cors';

dotenv.config();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

connectToMongoDB();

app.use("/api", routes);
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Express is listening at http://localhost:${PORT}`);
});
