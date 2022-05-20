import express from "express"
import {
  loginAuthentication,
  userRequired,
} from "../middlewares/interceptor.js"
import { addComment, deleteComment } from "../controllers/comment.controller.js"

const router = express.Router()

router

  .patch("/:idPost", loginAuthentication, addComment)
  .patch(
    "/:id/deleteComment/:idPost",
    loginAuthentication,
    userRequired,
    deleteComment
  )

export default router
