import express from "express"
import { loginAuthentication } from "../middlewares/interceptor.js"
import { addComment, deleteComment } from "../controllers/comment.controller.js"
import { getListPhotos } from "../controllers/users/addPhotos.controller.js"

const router = express.Router()

router
  .get("/", loginAuthentication, getListPhotos)
  .patch("/:idPost", loginAuthentication, addComment)
  .delete("/:idPost/:idComment", loginAuthentication, deleteComment)

export default router
