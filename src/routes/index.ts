
import * as express from "express";
const router = express.Router();

import { register } from "../controllers/auth/register.controller";
import { registerValidate } from "../utils/validations/registerValidate";
import handleLogin from "../controllers/auth/login.controller";
import { loginValidate } from "../utils/validations/loginValidate";
import { handleCheckUserExist } from "../controllers/auth/checkUserExist.controller";
import { userEmailRequireValidate } from "../utils/validations/userExistValidate";
import { validateFirebaseToken } from "../utils/middleware";
import { handleUpdateUserIsVerified } from "../controllers/auth/updateUserIsVerified.controller";
import { createOtp } from "../controllers/auth/createOtp.controller";
import { manualTradeValidate } from "../utils/validations/manualTradeValidate";
import { handleManualTrade } from "../controllers/trades/createManualTrade.controller";
import { handleUpdateManualTrade } from "../controllers/trades/updateManualTrade.controller";
import { handleGetTrade } from "../controllers/trades/getTradeById.controller";
import { handleGetTrades } from "../controllers/trades/getAllTRades.controller";
import { handleDeleteTrades } from "../controllers/trades/deleteTrades.controller";
import { handleUploadTrades } from "../controllers/trades/uploadTrades.controller";
import multerUpload from "../utils/storeCsv"
import { allTradeValidate } from "../utils/validations/allTradeValidate";
import { handleUpdateUserProfile } from "../controllers/user/updateUserProfile.controller";
import { handleGetUserProfile } from "../controllers/user/userProfile.controller";
import { updateUserProfileValidate } from "../utils/validations/updateProfileValidate";

router.post("/sign-up",registerValidate, register);
router.post("/sign-in",loginValidate, handleLogin)
router.post("/check-user-exist",validateFirebaseToken, userEmailRequireValidate, handleCheckUserExist)
router.put("/update-user-status",validateFirebaseToken, userEmailRequireValidate, handleUpdateUserIsVerified)
router.post("/create-otp",userEmailRequireValidate, createOtp)
router.post("/add-manual-trade", validateFirebaseToken, manualTradeValidate, handleManualTrade)
router.put("/update-trade/:id", validateFirebaseToken, manualTradeValidate, handleUpdateManualTrade)
router.get("/get-trade/:id", validateFirebaseToken, handleGetTrade)
router.get("/get-all-trades", validateFirebaseToken, allTradeValidate, handleGetTrades)
// handle delete request with post because want to send the id'd in the body
router.delete("/delete-trade/:id", validateFirebaseToken, handleDeleteTrades)
// handle file upload for trades
router.post("/upload-trades",multerUpload.single("file"), handleUploadTrades)
router.post('/test', validateFirebaseToken);
// handle User profile 
router.get("/get-user-profile", validateFirebaseToken, handleGetUserProfile) 
router.put("/update-user-profile/:id", validateFirebaseToken, updateUserProfileValidate, handleUpdateUserProfile) 

export default router;
