import express from "express"
/* app modules */
import Node from "src/Node/Node"

const router = express.Router()

const node = new Node()

router.get("/", (req, res) => {
  // get all nodes in  anetwork
  return res.json([])
})

router.get("/me", (req, res) => {
  // ger my node info
  return res.json(node.info)
})

export default router
