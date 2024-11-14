
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

router.post("/sign-up",registerValidate, register);
router.post("/sign-in",loginValidate, handleLogin)
router.post("/check-user-exist",userEmailRequireValidate, handleCheckUserExist)
router.put("/update-user-status",userEmailRequireValidate, handleUpdateUserIsVerified)
router.post("/create-otp",userEmailRequireValidate, createOtp)
router.post('/test', validateFirebaseToken)
export default router;