import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()
  console.log(req.body)

  try {
    const comment = req.body
    // author_id = author_id._id.toString()
    console.log("que trae el comment", req.body)

    const postId = req.params.idPost
    console.log(postId)
    const id = req.tokenPayload.id
    console.log(id)

    const resp = await Post.findById(postId)
    if (!resp) {
      next(404)
    }

    const response = await Post.findByIdAndUpdate(
      postId,

      {
        $push: { comments: comment },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "username",
        },
        {
          path: "user",
          select: "name",
        },
      ],
    })

    //   "comments", [
    //   {
    //     path: "author_id",
    //     populate: [
    //       {
    //         path: "User",
    //         select: "username",
    //       },
    //     ],
    //   },
    //   {
    //     path: "content",
    //     select: "name",
    //   },
    // ])

    await User.findByIdAndUpdate(
      id,
      {
        $push: { comments: comment },
      },
      { new: true }
    ).populate("posts", [
      {
        path: "comments",
        populate: [
          {
            path: "author_id",
            select: "username",
          },
          {
            path: "user",
            select: "name",
          },
        ],
      },
    ])
    // .populate("posts", [
    //   {
    //     populate: "comments",
    //     populate: [
    //       {
    //         path: "content",
    //         select: "name",
    //       },
    //       {
    //         path: "author_id",
    //         populate: [
    //           {
    //             path: "User",
    //             select: "username",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // ])

    // await User.findByIdAndUpdate(id).populate("comments", [
    //   {
    //     path: "author_id",
    //     populate: [
    //       {
    //         path: "User",
    //         select: "username",
    //       },
    //     ],
    //   },
    //   {
    //     path: "content",
    //     select: "name",
    //   },
    // ])

    res.status(201)
    console.log("respuesta", response)
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
