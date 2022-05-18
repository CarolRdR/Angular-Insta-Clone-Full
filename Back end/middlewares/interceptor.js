import { User } from "../model/user.model.js"
import { verifyToken } from "../services/auth.js"
import { initialUser } from "../helpers/initialUser.js"

export const loginAuthentication = (req, res, next) => {
  const authorization = req.get("authorization")
  let token
  let decodedToken
  const tokenError = new Error("Token missing or invalid")
  tokenError.status = 401

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7)
    decodedToken = verifyToken(token)
    if (typeof decodedToken === "string") {
      next(tokenError)
    } else {
      req.tokenPayload = decodedToken
      next()
    }
  } else {
    next(tokenError)
  }
}
export const loginWithToken = async (req, res, next) => {
  const authorization = req.get("authorization")
  let token
  let decodedToken
  const tokenError = new Error("Token missing or invalid")
  tokenError.status = 401

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7)
    decodedToken = verifyToken(token)
    if (typeof decodedToken === "string") {
      next()
    } else {
      const data = await initialUser(decodedToken.email)
      if (!data) {
        next()
      }

      const dataFinal = data._doc

      delete dataFinal.password
      delete dataFinal.email
      res.json({
        token,
        ...data?._doc,
      })
    }
  } else {
    next()
  }
}

export const userRequired = async (req, res, next) => {
  let tokenInfo = req.tokenPayload

  const user = await User.findById(req.params.id)

  if (user._id.toString() === tokenInfo.id) {
    next()
  } else {
    const userError = new Error("User not authorized")
    userError.status = 401
    next(userError)
  }
}
