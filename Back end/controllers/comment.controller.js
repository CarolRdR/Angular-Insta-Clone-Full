import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

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

export const addComment = async (req, res, next) => {
  await mongoConnect()

  // const { posts } = req.body
  // const postComment = posts[0].comments[0].content
  try {
    const commentId = req.body
    console.log(commentId, "pepe")
    const postId = req.params.idPost
    const { id } = req.tokenPayload

    const resp = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: commentId },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: [
        {
          path: "author_id", // MODELO COMMENT
          select: "userName",
        },
        {
          path: "content", // MODELO COMMENT
          select: "name",
        },
      ],
    })

    await User.findByIdAndUpdate(
      id,
      {
        $push: { posts: commentId },
      },
      { new: true }
    )
    await Post.findById(postId).populate({
      path: "comments",
      // populate: [
      //   {
      //     path: "author_id", // MODELO COMMENT
      //     select: "name",
      //   },
      //   {
      //     path: "content", // MODELO COMMENT
      //     select: "name",
      //   },
      // ],
    })

    res.status(201)
    res.json(resp)
  } catch (err) {
    next(createError(err))
  }
}
