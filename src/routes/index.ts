
import * as express from "express";
const router = express.Router();

import { register } from "../controllers/auth/register.controller";
import { registerValidate } from "../utils/validations/registerValidate";

router.post("/sign-up",registerValidate, register);

export default router;