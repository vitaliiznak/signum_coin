import path from "path"
require("dotenv").config({ path: path.join(__dirname, "../.env") })

export default {
  uri: `//localhost:${process.env.PORT}`,
  peers: process.env.PEERS.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/)
}
