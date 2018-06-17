import express from "express"
import bodyParser from "body-parser"
import Joi from "joi"
import fetch from "node-fetch"
/* app modules */
import Blockchain from "src/Blockchain/Blockchain"
import Transaction from "src/Blockchain/Transaction"

const router = express.Router()

const peerNodes = ["//localhost:3000"]
let thisNodesTransactions = []
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
    const txion = new Transaction({
      ...req.body
    })
    thisNodesTransactions.push(txion)
    res.json(req.body)
  }
)

router.post("/mine/:toAddress", (req, res) => {
  // get the last nonce
  const { toAddress } = req.params

  const previousBlock = blockchain.latestBlock
  const proof = ProofOfWork(previousBlock.proof)
  const transaction = new Transaction({
    from: "network",
    to: toAddress || minerAddress,
    amount: 1
  })
  thisNodesTransactions.push(transaction)

  const newBlock = blockchain.generateNextBlock(
    {
      transactions: thisNodesTransactions
    },
    proof
  )
  thisNodesTransactions = []
  res.set("Content-Type", "application/json; charset=utf-8")
  res.send(newBlock.serialize())
})

router.get("/blocks", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  // get the last nonce
  const serializedBlockchain = blockchain.serialize()
  res.set("Content-Type", "application/json; charset=utf-8")
  return res.send(serializedBlockchain)
})

router.get("/balance/:address", (req, res) => {
  // get the last nonce
  const { address } = req.params

  const balance = blockchain.getBalanceOfAddress(address)

  return res.json({
    address,
    balance
  })
})

export default router
