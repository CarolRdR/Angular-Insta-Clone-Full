import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"

export const deletePost = async (req, res, next) => {
  await mongoConnect()

  try {
    const idPost = req.body
    const userId = req.tokenPayload.id

    const response = await Post.findByIdAndDelete(idPost, {
      new: true,
    })

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { posts: idPost },
      },
      { new: true }
    )

    res.json(response)
  } catch (error) {
    next(createError(error))
  }
}
