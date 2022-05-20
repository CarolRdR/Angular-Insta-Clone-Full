import { Post } from "../../model/post.model.js"
import { createError } from "../../services/errors.js"
import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"

export const deletePost = async (req, res, next) => {
  await mongoConnect()
  console.log(req.params)
  try {
    const idPost = req.params.idPost
    console.log(idPost)
    const id = req.params.id
    console.log(id)

    const response = await Post.findByIdAndDelete(idPost)

    await User.findByIdAndUpdate(id, {
      $pull: { posts: idPost },
    })
    console.log(response)
    res.json(response)
  } catch (err) {
    console.log("Error al borrar la ruina")
    next(err, "no se ha podido borrar la ruina especificada.")
  }

  // try {
  //   const idPost = req.params.idPost
  //   console.log(idPost)
  //   const userId = req.params.id
  //   console.log(userId)
  //   // let tokenInfo = req.tokenPayload
  //   // console.log(tokenInfo.id)

  //   const response = await Post.findByIdAndDelete(idPost)

  //   if (response) {
}

// else {
//   res.status(404)
//   res.json({ message: "Post does not exist" })
// }

//   //  await Post.findByIdAndUpdate(
//   //       userId,
//   //       {
//   //         $pull: { posts: idPost },
//   //       },
//   //       { new: true }
//   //     )
// } catch (error) {
//   next(createError(error))
// }
