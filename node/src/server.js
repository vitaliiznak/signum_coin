import cors from "cors"
//app modules

import feathers from "@feathersjs/feathers"
import express from "@feathersjs/express"
//app modules
import blockchainRouter from "./restApi/blockchainRoutes"
import nodeRouter from "./restApi/nodeRoutes"

const app = express()
app.use(cors())

app.use("/blockchain", blockchainRouter)
app.use("/nodes", nodeRouter)

const port = process.env.PORT
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
