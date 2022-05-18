import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
})

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.password
    delete returnedObject.email
  },
})

export const User = mongoose.model("User", userSchema)
