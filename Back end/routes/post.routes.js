import express from "express"

import {
  loginAuthentication,
  userRequired,
} from "../middlewares/interceptor.js"

import { deletePost } from "../controllers/users/deletePhotos.controller.js"
import {
  getIndividualPhoto,
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
  .get("/:idPost", loginAuthentication, getIndividualPhoto)

export default router
