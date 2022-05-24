import { mongoConnect } from "../../services/db.js"
import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { User } from "../../model/user.model.js"

export const uploadPhotos = async (req, resp, next) => {
  await mongoConnect()

  try {
    const url = req.body
    const userId = req.tokenPayload.id
    const user = req.params.id

    const response = await Post.create(url, user, {
      new: true,
    })
    const postId = response[0]._id

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
          select: "username",
        },
        {
          path: "content",
          select: "name",
        },
      ],
      path: "user",
      populate: [
        {
          path: "username",
          select: "username",
        },
      ],
    })

    resp.json(response)
  } catch (error) {
    next(createError(error))
  }
}

export const getListPhotos = async (req, resp, next) => {
  await mongoConnect()

  try {
    const { posts } = req.body

    let foundPosts = await User.find({
      post: { $in: posts },
    }).populate("posts")

    if (!foundPosts) {
      next(204)
    }

    foundPosts = foundPosts.map((data) => {
      const { posts } = data

      return posts
    })

    resp.json(foundPosts)
  } catch (error) {
    next(createError(error, 404))
  }
}

export const getIndividualPhoto = async (req, resp, next) => {
  await mongoConnect()
  try {
    const { comments } = req.body

    let foundPost = await Post.findById(req.params, {
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

    resp.json(foundPost)
  } catch (error) {
    next(createError(error, 404))
  }
}
