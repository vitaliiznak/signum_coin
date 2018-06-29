import express from "express"
import bodyParser from "body-parser"

/* app modules */
import { node } from "../model"

const router = express.Router()

router.post("/uri", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  // get all nodes in  anetwork
  const uri = node.addUri(req.body.uri)
  return res.json(uri)
})

router.post("/uri/remove", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  // get all nodes in  anetwork
  const uri = node.removeUri(req.body.uri)
  return res.json(uri)
})

router.post("/uri/activate", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  // get all nodes in  anetwork
  const uri = node.activatePeer(req.body.uri)
  return res.json(uri)
})
router.post(
  "/uri/deactivate",
  bodyParser.json({ limit: "1Mb" }),
  (req, res) => {
    // get all nodes in  anetwork
    const uri = node.deactivatePeer(req.body.uri)
    return res.json(uri)
  }
)

router.get("/uri", (req, res) => {
  // get all nodes in  anetwork

  return res.json(node.knownPeers)
})

router.get("/me", (req, res) => {
  // ger my node info
  console.log(node.info)
  return res.json(node.info)
})

export default router
