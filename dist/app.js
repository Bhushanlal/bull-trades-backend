"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose_1 = require("mongoose");
app.use(express.json());
// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));
mongoose_1.default.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT, () => {
    return console.log(`Express is listening at http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map