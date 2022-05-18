import bcrypt from "bcryptjs"
import { initialUser } from "../../helpers/initialUser.js"
import { createToken } from "../../services/auth.js"

export const loginUser = async (req, resp, next) => {
  const user = req.body
  const loginError = new Error("User or Password invalid ")
  loginError.status = 401

  if (!user.email || !user.password) {
    next(loginError)
  } else {
    const userFound = await initialUser(user.email)

    if (!userFound) {
      next(loginError)
    } else if (!bcrypt.compareSync(user.password, userFound.password)) {
      next(loginError)
    } else {
      const id = userFound.id

      const token = createToken({
        email: userFound.email,
        id,
      })
      resp.json({
        token,
        email: userFound.email,
        id: userFound.id,
        profileImage: userFound.profileImage,
        username: userFound.username,
        posts: userFound.posts,
        // userFound,
      })
    }
  }
}
