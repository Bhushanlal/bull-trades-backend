
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

router.post("/sign-up",registerValidate, register);
router.post("/sign-in",loginValidate, handleLogin)
router.post("/check-user-exist",userEmailRequireValidate, handleCheckUserExist)
router.put("/update-user-status",userEmailRequireValidate, handleUpdateUserIsVerified)
router.post("/create-otp",userEmailRequireValidate, createOtp)
router.post("/add-manual-trade",manualTradeValidate, handleManualTrade)
router.put("/update-trade/:id",manualTradeValidate, handleUpdateManualTrade)
router.get("/get-trade/:id", handleGetTrade)
router.get("/get-all-trades", handleGetTrades)
// handle delete request with post because want to send the id'd in the body
router.post("/delete-trades", handleDeleteTrades)
router.post('/test', validateFirebaseToken)
export default router;