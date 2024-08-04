import express from "express";
import { uploadFile } from "../utils/multer.js";

import {
  register,
  login,
  getuser,
  logout,
} from "../controller/user.controller.js";
const router = express.Router();
import { verifyToken } from "../middleware/auth.middle.ware.js";

router.route("/register").post(uploadFile, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(verifyToken, getuser);
export default router;
