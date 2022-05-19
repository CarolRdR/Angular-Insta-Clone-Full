import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()
  console.log(req.body)
  try {
    const { content, author_id } = req.body
    console.log("que trae el comment", { content, author_id })

    const postId = req.params.idPost
    console.log(postId)
    const id = req.tokenPayload

    const resp = await Post.findById(postId)
    if (!resp) {
      next(404)
    }

    const response = await Post.findByIdAndUpdate(
      postId,

      {
        $push: { comments: { content, author_id } },
      },
      { new: true }
    ).populate("comments", [
      {
        path: "author_id",
        select: "name",
      },
      {
        path: "content",
        select: "name",
      },
    ])

    await User.findByIdAndUpdate(
      id
      // {
      //   $push: { posts: postId },
      // },
      // { new: true }
    ).populate("posts")

    res.status(201)
    res.json(response)
  } catch (err) {
    next(err, "no se ha podido crear el comentario especificado.")
  }
}

export const deleteComment = async (req, res, next) => {
  await mongoConnect()

  try {
    const commentId = req.body

    const postId = req.params.idPost

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: commentId },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "userName",
        },
        {
          path: "content",
          select: "name",
        },
      ],
    })

    if (!post) {
      return next(400).send("Post not found")
    }

    const updatedPost = await Post.findById(postId).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "userName",
        },
        {
          path: "content",
          select: "name",
        },
      ],
    })
    console.log(updatedPost)
    res.json(updatedPost)
  } catch (err) {
    next(createError(err))
  }
}
