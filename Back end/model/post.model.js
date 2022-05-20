import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  url: String,
  comments: [
    {
      author_id: { type: mongoose.Types.ObjectId, ref: "User" },
      content: String,
    },
  ],
  user: { type: mongoose.Types.ObjectId, ref: "User" },
})

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
    delete returnedObject.password
    delete returnedObject.email
  },
})

export const Post = mongoose.model("Post", postSchema)
