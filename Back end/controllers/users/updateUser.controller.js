import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"
import { createError } from "../../services/errors.js"

export const updateUser = async (req, res, next) => {
  await mongoConnect()

  try {
    console.log("me hace update", req.body.userFound)
    const response = await User.findByIdAndUpdate(
      req.params.id,
      req.body.userFound,
      {
        new: true,
      }
    )

    res.json(response)
  } catch (error) {
    next(createError(error))
  }
}
