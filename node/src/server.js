import dotenv from "dotenv"
import path from "path"
import morgan from "morgan"

dotenv.config({ path: path.join(__dirname, "../.env") })

import cors from "cors"
//app modules

import express from "@feathersjs/express"
//app modules
import blockchainRouter from "./restApi/blockchainRoutes"
import nodeRouter from "./restApi/nodeRoutes"

const app = express()
app.use(cors())
app.use(morgan("combined"))

app.use("/blockchain", blockchainRouter)
app.use("/nodes", nodeRouter)

const port = process.env.PORT
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
