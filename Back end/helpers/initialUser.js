import { User } from "../model/user.model.js"

export const initialUser = async (email) => {
  return User.findOne({
    email: email,
  }).populate(
    "posts"
    // {
    //   populate: "comments",
    // }
  )
}
