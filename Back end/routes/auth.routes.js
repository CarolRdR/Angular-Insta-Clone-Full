import express from "express"
import { loginUser } from "../controllers/auth/login.controller.js"
import { registerUser } from "../controllers/auth/register.controller.js"
import { loginWithToken } from "../middlewares/interceptor.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginWithToken, loginUser)

export default router
