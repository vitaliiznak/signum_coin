import express from "express"
import bodyParser from "body-parser"
import Joi from "joi"
import fetch from "node-fetch"
/* app modules */

import Blockchain from "src/Blockchain/Blockchain"
import { blockchain, node } from "../model"
const router = express.Router()

const transactionValidator = Joi.object().keys({
  id: Joi.string(),
  hash: Joi.string(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  toUri: Joi.string(),
  amount: Joi.number()
    .integer()
    .min(0)
    .required()
})
// .with("username", "birthyear")

function proofOfWork(nonce) {
  let incrementor = nonce + 1
  while (!(incrementor % 9 === 0 && incrementor > nonce)) {
    incrementor += 1
  }
  return incrementor
}

async function getDivergeBranch(referer, divergeBlock) {
  let reversedBranch = []
  let blockInBranch = divergeBlock
  let blockInBlockchainByBranchIndex = null
  for (
    let indexInBranch = divergeBlock.index - 1;
    indexInBranch > 0 &&
    (!blockInBlockchainByBranchIndex ||
      blockInBlockchainByBranchIndex.hash !== blockInBranch.hash);
    --indexInBranch
  ) {
    // find the point where fork heapens
    reversedBranch.push(Blockchain.makeBlockFromJson(blockInBranch))
    try {
      blockInBranch = await fetch(
        `http:${referer}/blockchain/${indexInBranch}`
      ).then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw res
        }
      })
    } catch (err) {
      console.trace()
      console.error(err)
      reversedBranch = []
      break
    }
    blockInBlockchainByBranchIndex = blockchain.findBlockByIndex(indexInBranch)
    let validationResult = Blockchain.validateBlock(
      reversedBranch[reversedBranch.length - 1],
      Blockchain.makeBlockFromJson(blockInBranch)
    )
    if (!validationResult.status) {
      console.trace()
      console.error(validationResult)
      reversedBranch = []
      break
    }
  }
  return reversedBranch.reverse()
  //validate new blocks + merge blockchains
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

router.get("/transaction/:id", (req, res) => {
  const foundItem = blockchain.findTransaction(req.params.id)
  if (!foundItem) {
    res.status(404).json({
      message: "transaction not found"
    })
  }
  res.json(foundItem)
})

router.post("/transaction", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  const result = Joi.validate(req.body, transactionValidator, {
    abortEarly: false
  })
  if (result.error) {
    return res.status(400).json({
      message: result.error
    })
  }

  try {
    const transaction = blockchain.addPendingTransaction({ ...req.body })
    node.knownPeers.forEach(({ uri, active }) => {
      if (uri !== node.uri && active) {
        fetch(`http:${uri}/blockchain/transaction`, {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(transaction)
        })
          .then(res => res)
          .catch(err => {
            console.error(err)
          })
      }
    })
  } catch (err) {
    if (err.status !== undefined) {
      return res.status(409).json(err)
    } else {
      throw err
    }
  }
  res.json(req.body)
})

router.get("/:index", bodyParser.json({ limit: "1Mb" }), (req, res) => {
  const foundItem = blockchain.findBlockByIndex(Number(req.params.index))

  if (!foundItem) {
    res.status(404).json({
      message: "block not found"
    })
  }
  res.json(foundItem)
})

router.post("/", bodyParser.json({ limit: "1Mb" }), async (req, res) => {
  if (req.header.referer) {
    res.status(400)
  }
  const block = blockchain.makeBlockFromJson(req.body)

  if (
    blockchain.latestBlock.hash !== block.previousHash &&
    blockchain.latestBlock.acumProofComplexity < block.acumProofComplexity
    /*   blockchain fork detected*/
  ) {
    const branch = await getDivergeBranch(req.headers.referer, block)
    blockchain.mergeBranch(branch)

    //get blockchain from referer
    return res.json(req.body)
  }
  blockchain.addBlock(block)
  res.json(req.body)
})

router.post("/mine", (req, res) => {
  const previousBlock = blockchain.latestBlock
  const proof = proofOfWork(previousBlock.proof)

  blockchain.addPendingTransaction({
    from: "network",
    to: node.address,
    amount: 1
  })

  const newBlock = blockchain.generateBlock(proof)

  node.knownPeers.forEach(({ uri, active }) => {
    if (uri !== node.uri && active) {
      fetch(`http:${uri}/blockchain`, {
        method: "POST",
        headers: {
          referer: node.uri,
          "content-type": "application/json"
        },
        body: newBlock.serialize()
      })
        .then(res => res)
        .catch(err => {
          console.error(err)
        })
    }
  })
  res.set("Content-Type", "application/json; charset=utf-8")
  res.send(newBlock.serialize())
})

router.post("/consensus", (req, res, next) => {
  res.json({})
})

export default router
