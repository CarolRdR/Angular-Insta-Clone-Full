import express from "express"
import {
  loginAuthentication,
  loginWithToken,
  userRequired,
} from "../middlewares/interceptor.js"
import { addComment, deleteComment } from "../controllers/comment.controller.js"
import { deletePost } from "../controllers/users/deletePhotos.controller.js"
import {
  getListPhotos,
  uploadPhotos,
} from "../controllers/users/addPhotos.controller.js"
import { updateUser } from "../controllers/users/updateUser.controller.js"

const router = express.Router()

router
  .get("/", loginAuthentication, getListPhotos)
  .post("/", loginAuthentication, uploadPhotos)
  .patch("/:id", loginAuthentication, updateUser)
  .delete("/:id/:idPost", loginAuthentication, userRequired, deletePost)

  .patch(
    "/:id/addComment/:idPost",
    loginAuthentication,
    userRequired,
    addComment
  )
  .patch(
    "/:id/deleteComment/:idPost",
    loginAuthentication,
    userRequired,
    deleteComment
  )

export default router
