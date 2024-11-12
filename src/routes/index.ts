
import * as express from "express";
const router = express.Router();

import { register } from "../controllers/auth/register.controller";
import { registerValidate } from "../utils/validations/registerValidate";
import handleLogin from "../controllers/auth/login.controller";
import { loginValidate } from "../utils/validations/loginValidate";

router.post("/sign-up",registerValidate, register);
router.post("/sign-in",loginValidate, handleLogin)
router.post("/check-user-exist")
export default router;