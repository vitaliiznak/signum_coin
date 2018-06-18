import express from "express"
import bodyParser from "body-parser"
import Joi from "joi"
import fetch from "node-fetch"
/* app modules */
import Blockchain from "src/Blockchain/Blockchain"

const router = express.Router()

const peerNodes = ["//localhost:3000"]
const blockchain = new Blockchain()

const transactionValidator = Joi.object().keys({
  from: Joi.string().required(),
  to: Joi.string().required(),
  amount: Joi.number()
    .integer()
    .min(0)
    .required()
})
// .with("username", "birthyear")

function ProofOfWork(nonce) {
  let incrementor = nonce + 1
  while (!(incrementor % 9 === 0 && incrementor > nonce)) {
    incrementor += 1
  }
  return incrementor
}

function findNewChains() {
  const otherChains = []

  for (let nodeUrl of peerNodes) {
    let blocks = fetch(`${nodeUrl}/blocks`).then(res => res.json())

    otherChains.push(blocks)
  }

  return otherChains
}

function consensus() {
  const otherChains = findNewChains()
  let longestChain = JSON(blockchain.serialize())
  for (let blocks of otherChains) {
    if (longestChain.length < blocks.length) {
      longestChain = blocks
    }
  }
  blockchain.blocks = longestChain
}

router.get("/blocks", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  const serializedBlockchain = blockchain.serialize()
  res.set("Content-Type", "application/json; charset=utf-8")
  return res.send(serializedBlockchain)
})

router.get("/balance/:address", (req, res) => {
  const { address } = req.params

  const balance = blockchain.getBalanceOfAddress(address)

  return res.json({
    address,
    balance
  })
})

router.post(
  "/transaction",
  bodyParser.json({ limit: "1Mb" }),
  (req, res, next) => {
    const result = Joi.validate(req.body, transactionValidator, {
      abortEarly: false
    })
    if (result.error) {
      return res.status(400).json({
        message: result.error
      })
    }
    try {
      blockchain.addPendingTransaction({ ...req.body })
    } catch (err) {
      if (err.type === "treatable") {
        return res.status(409).json(err)
      } else {
        throw err
      }
    }
    res.json(req.body)
  }
)

router.post("/mine/:toAddress", (req, res) => {
  const { toAddress } = req.params

  const previousBlock = blockchain.latestBlock
  const proof = ProofOfWork(previousBlock.proof)

  blockchain.addPendingTransaction({
    from: "network",
    to: toAddress || minerAddress,
    amount: 1
  })

  const newBlock = blockchain.generateNextBlock(proof)
  res.set("Content-Type", "application/json; charset=utf-8")
  res.send(newBlock.serialize())
})

router.post("/consensus", (req, res, next) => {
  res.json({})
})

export default router
