import cors from "cors"
//app modules

import feathers from "@feathersjs/feathers"
import express from "@feathersjs/express"
//app modules
import blockchainRouter from "./apps/blockchain"
import nodeRouter from "./apps/node"

const app = express()
app.use(cors())

app.use("/blockchain", blockchainRouter)
app.use("/node", nodeRouter)

app.listen(3000, () => console.log("Example app listening on port 3000!"))
