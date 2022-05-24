import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()

  try {
    const { content, author_id } = req.body.comments[0]

    const postId = req.params.idPost

    // const userId = req.tokenPayload.id

    const resp = await Post.findById(postId)
    if (!resp) {
      next(404)
    }

    const response = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            content: content,
            author_id: author_id,
          },
        },
      },
      { new: true }
    ).populate({
      path: "comments",
      _id: 1,
      populate: [
        {
          path: "author_id",
          populate: [{ path: "username", select: "username" }],
        },
        {
          path: "user",
          populate: [{ path: "_id", select: "_id" }],
        },
      ],
    })

    res.status(201)
    console.log(response)
    res.json(response)
  } catch (err) {
    next(createError(err, "No se ha podido crear el comentario especificado."))
  }
}

export const deleteComment = async (req, res, next) => {
  await mongoConnect()

  try {
    const { idPost, idComment } = req.params
    const post = await Post.findById(idPost)

    // Pull out comment
    const comment = post.comments.find((comment) => comment.id === idComment)

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" })
    }

    // Check user
    if (comment.author_id._id.toString() !== req.tokenPayload.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Get remove index
    const removeIndex = post.comments
      .map((comment) => comment.author_id._id.toString())
      .indexOf(req.tokenPayload.id)
    console.log(removeIndex)
    post.comments.splice(removeIndex, 1)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
}
