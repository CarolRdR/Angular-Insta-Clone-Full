import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"

export const deletePost = async (req, res, next) => {
  await mongoConnect()
  console.log(req.params)
  try {
    const idPost = req.params.idPost
    console.log(idPost)
    const id = req.params.id
    console.log(id)

    const response = await Post.findByIdAndDelete(idPost)

    await User.findByIdAndUpdate(id, {
      $pull: { posts: idPost },
    })
    console.log(response)
    res.json(response)
  } catch (err) {
    next(createError(err))
  }
}
