import express from "express"
/* app modules */
import Node from "src/Node/Node"

const router = express.Router()

const node = new Node()

router.get("/", (req, res) => {
  // get the last nonce
  return res.json(node.info)
})

export default router
