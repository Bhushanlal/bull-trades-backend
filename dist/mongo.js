var _a;
const mongoose = require("mongoose");
const uri = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : "";
() => {
    mongoose.connect(uri);
    console.log("connected to DB");
};
//# sourceMappingURL=mongo.js.map