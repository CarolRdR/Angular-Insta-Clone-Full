import { mongoConnect } from "../services/db.js"
import { Post } from "../model/post.model.js"
import { User } from "../model/user.model.js"
import { createError } from "../services/errors.js"

export const addComment = async (req, res, next) => {
  await mongoConnect()
  console.log(req.body.comments)

  try {
    // const comment = req.body.comments
    // console.log(comment)
    // const content = req.body.comments[0].content
    // console.log(content)
    // const { author_id } = req.body.comments[0].author_id

    const { content } = req.body.comments[0]
    const { author_id } = req.body.comments[0].author_id
    console.log(author_id)
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
        $push: {
          comments: { content, author_id },
        },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          populate: "username",
        },
        {
          path: "content",
          select: "name",
        },
      ],
    })

    // .populate("comments", [
    //   {
    //     path: "author_id",
    //     select: "username",
    //   },
    //   {
    //     path: "content",
    //     select: "name",
    //   },
    // ]

    // )

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

    // await Post.findByIdAndUpdate(postId).populate({
    //   path: "comments",
    //   populate: [
    //     {
    //       path: "author_id",
    //       select: "userName",
    //     },
    //     {
    //       path: "user",
    //       select: "name",
    //     },
    //   ],
    // })

    await User.findByIdAndUpdate(
      id
      // {
      //   $push: { comments: comment },
      // },
      // { new: true }
    ).populate(
      "posts"
      // [
      //   {
      //     populate: "comments",

      //     path: "author_id",
      //     select: "username",

      //     path: "content",
      //     select: "name",
      //   },
      // ]
    )
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
