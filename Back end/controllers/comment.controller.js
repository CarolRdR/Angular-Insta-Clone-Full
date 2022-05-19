import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()

  // try {
  //   const resp = await Post.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //   })
  //   console.log(resp, " RUINA ACTUALIZADA EN BACK")
  //   res.status(201)
  //   res.json(resp)
  // } catch (err) {
  //   next(err, "no se ha podido actualizar la ruina especificada.")
  // }

  try {
    const { content, author_id } = req.body

    const postId = req.params.idPost
    const { id } = req.tokenPayload

    const resp = await Post.findById(postId)
    if (!resp) {
      next(404)
    }

    const response = await Post.findByIdAndUpdate(
      postId,

      {
        $push: { comments: { content } },
      },
      { new: true }
    ).populate("comments", [
      {
        path: "author_id",
        select: "username",
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

    console.log("Ruina actualizada, ", response)

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
    console.log(commentId)
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
