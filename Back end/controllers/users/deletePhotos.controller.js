import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"

export const deletePost = async (req, res, next) => {
  await mongoConnect()

  try {
    const id = req.params.id

    const idPost = req.params.idPost

    const response = await Post.findByIdAndDelete(idPost)

    await User.findByIdAndUpdate(id, {
      $pull: { posts: idPost },
    })

    res.json(response)
  } catch (err) {
    next(createError(err))
  }
}
