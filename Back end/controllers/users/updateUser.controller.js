import { mongoConnect } from "../../services/db.js"
import { User } from "../../model/user.model.js"
import { createError } from "../../services/errors.js"

export const updateUser = async (req, res, next) => {
  await mongoConnect()

  try {
    // const profileImage = req.body

    const response = await User.findByIdAndUpdate(
      req.tokenPayload.id,
      req.body,

      {
        new: true,
      }
    )

    res.json(response)
  } catch (error) {
    next(createError(error))
  }
}
