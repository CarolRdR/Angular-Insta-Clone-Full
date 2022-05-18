import { mongoConnect } from "../../services/db.js"
import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { User } from "../../model/user.model.js"

export const uploadPhotos = async (req, resp, next) => {
  await mongoConnect()

  const url = req.body

  const userId = req.tokenPayload.id
  console.log(userId)

  try {
    const response = await Post.create(url, {
      new: true,
    })
    const postId = response[0]._id
    console.log(postId)

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { posts: postId },
      },
      { new: true }
    )

    await Post.findByIdAndUpdate(postId).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "userName",
        },
        {
          path: "user",
          select: "name",
        },
      ],
    })

    const result = {
      response,
    }

    resp.json(result)
  } catch (error) {
    next(createError(error))
  }
}

export const getListPhotos = async (req, resp, next) => {
  await mongoConnect()
  try {
    const { posts } = req.body
    console.log("body", req.body)

    let foundPosts = await User.find({
      post: { $in: posts },
    }).populate("posts")

    if (!foundPosts) {
      next(204)
    }

    foundPosts = foundPosts.map((post) => {
      const { posts } = post._doc
      // comments, url, user

      return posts
    })
    console.log("lo que me trae posts", foundPosts)
    resp.json(foundPosts)
  } catch (error) {
    next(createError(error, 404))
  }
}

export const getIndividualPhoto = async (req, resp, next) => {
  await mongoConnect()
  try {
    const { comments } = req.body
    console.log(req.body)

    let foundPost = await Post.find({
      comment: { $in: comments },
    }).populate("comments")

    if (!foundPosts) {
      next(204)
    }

    foundPost = foundPost.map((post) => {
      const { comments, url, user } = post._doc
      return {
        comments,
        url,
        user,
      }
    })
    console.log("lo que me trae posts", foundPost)
    resp.json(foundPost)
  } catch (error) {
    next(createError(error, 404))
  }
}
