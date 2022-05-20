import express from "express"
import {
  loginAuthentication,
  userRequired,
} from "../middlewares/interceptor.js"
import { addComment, deleteComment } from "../controllers/comment.controller.js"

const router = express.Router()

router

  .patch("/addComment/:idPost", loginAuthentication, userRequired, addComment)
  .patch(
    "/:id/deleteComment/:idPost",
    loginAuthentication,
    userRequired,
    deleteComment
  )
