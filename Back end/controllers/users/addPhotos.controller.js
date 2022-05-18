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

    await Post.findById(postId).populate({
      path: "comments",
      populate: [
        {
          path: "author_id",
          select: "userName",
        },
        {
          path: "userId",
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

    let foundPosts = await User.find({
      post: { $in: posts },
    }).populate("posts")

    if (!foundPosts) {
      next(204)
    }

    foundPosts = foundPosts.map((post) => {
      const { posts, comments, url, user } = post._doc
      return {
        posts,
        comments,
        url,
        user,
      }
    })
    console.log("lo que me trae posts", foundPosts)
    resp.json(foundPosts)
  } catch (error) {
    next(createError(error, 404))
  }
}
