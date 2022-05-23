import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()

  try {
    const { content, author_id } = req.body.comments[0]

    const postId = req.params.idPost

    const userId = req.tokenPayload.id

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
            author_id: author_id.id,
          },
        },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "username",
          populate: [{ path: "username", select: "username" }],
        },
        {
          path: "user",
          select: "name",
        },
      ],
    })
    const { comments } = response
    console.log(comments)

    res.status(201)

    res.json(response)
  } catch (err) {
    next(createError(err, "no se ha podido crear el comentario especificado."))
  }
}

export const deleteComment = async (req, res, next) => {
  await mongoConnect()
  console.log(req.params)
  try {
    const { idPost, idComment } = req.params

    const id = req.tokenPayload.id

    const post = await Post.findById(idPost)
    console.log(post)
    if (!post) {
      next(404)
    }
    // const post = await Post.findByIdAndUpdate(
    //   idPost,
    //   {
    //     $pull: { comments: idComment },
    //   },
    //   { new: true }
    // )
    // await User.findByIdAndUpdate(
    //   id,
    //   {
    //     $pull: { comments: commentId },
    //   },
    //   { new: true }
    // )
    const comment = post.comments.find((item) => item.id === idComment)
    console.log(comment)
    if (!comment) {
      next(404)
    }

    if (comment.author_id === id.toString()) {
      post.comments = post.comments.filter(({ id }) => id !== idComment)
    }
    await post.save()

    console.log(post)
    res.json(post)
  } catch (err) {
    next(createError(err))
  }
}
