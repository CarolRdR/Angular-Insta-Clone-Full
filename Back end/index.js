// import jsonServer from "json-server";
import express from "express"
import morgan from "morgan"
import * as dotenv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import authRouter from "./routes/auth.routes.js"
import photoRouter from "./routes/post.routes.js"
import communityRouter from "./routes/community.routes.js"

import { createServer } from "http"
import { mongoConnect } from "./services/db.js"

dotenv.config()
export const app = express()

const port = process.env.PORT || 5006
const http = createServer(app)

// const http = jsonServer.create();
// const router = jsonServer.router("db.json");
// const middlewares = jsonServer.defaults();

// http.use(middlewares);
// http.use(router);
mongoConnect()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(helmet())

app.use("/auth", authRouter)
app.use("/post", photoRouter)
app.use("/community", communityRouter)

app.use((err, req, resp, next) => {
  resp.status(401)
  resp.json({ Error: err.message })
})

export const server = http.listen(port, () => {
  console.log(`Server listening in http://localhost:${port}`)
})
