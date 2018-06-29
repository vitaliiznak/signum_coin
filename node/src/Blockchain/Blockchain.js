import Block from "./Block"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import filenamify from "filenamify"
/* app modules */
import Transaction from "src/Blockchain/Transaction"
import config from "config/index"

const adapter = new FileSync(`data/${filenamify(config.uri)}_db.json`)
let db = low(adapter)
db.defaults({ blocks: [] }).write()
db.readDb = () => low(adapter) //to liste on changes in fileitself

class Blockchain {
  constructor() {
    db.set("blocks", [this.createGenesisBlock()]).write()
    this.pendingTransactions = []
    this.miningReward = 100
  }

  get blocks() {
    return db
      .readDb()
      .get("blocks")
      .value()
  }

  get genesisBlock() {
    return db
      .readDb()
      .get("blocks[0].title")
      .value()
  }

  get latestBlock() {
    const blocks = db
      .readDb()
      .get("blocks")
      .value()
    return blocks[blocks.length - 1]
  }

  findBlockByIndex = index =>
    db
      .readDb()
      .get("blocks")
      .value()
      .find(record => record.index === index)

  findBlockByHash = hash =>
    db
      .readDb()
      .get("blocks")
      .value()
      .find(record => record.hash === hash)

  findTransaction = (id, withPending) => {
    let foundTransaction = null
    if (withPending) {
      foundTransaction = this.pendingTransactions.find(
        transaction => transaction.id === id
      )
      if (foundTransaction) return foundTransaction
    }
    return this.blocks.find(block =>
      block.data.transactions.find(transaction => transaction.id === id)
    )
  }

  addPendingTransaction = data => {
    const txion = new Transaction({
      ...data
    })

    const transactionFound = this.findTransaction(data.id, {
      isPending: true
    })
    if (transactionFound) {
      return {
        status: false,
        message: "transaction already discovered"
      }
    }

    const { status, ...validationData } = this.validateTransaction(txion)

    if (!status) {
      console.trace()
      console.error(validationData.message)
      throw {
        status: false,
        ...validationData
      }
    }
    this.pendingTransactions.push(txion)
    return txion
  }

  createGenesisBlock = () => {
    return new Block({
      index: 0, //index
      timestamp: new Date("1995-12-17T03:24:00").getTime() / 1000, //timestamp
      previousAcumProofComplexity: 0,
      data: {
        transactions: []
      }, //data
      proof: 9 //proof of work
    })
  }

  addBlock = block => {
    /* validate block */
    const result = this.validateBlock(block, this.latestBlock)
    if (!result.status) {
      console.trace()
      console.error(result)
      throw result
      return
    }

    db.readDb()
      .get("blocks")
      .push(block)
      .write()
    return block
  }

  generateBlock = proof => {
    const previousBlock = this.latestBlock
    const newBlock = new Block({
      index: previousBlock.index + 1,
      timestamp: Date.now() / 1000,
      data: {
        transactions: this.pendingTransactions
      },
      proof: proof,
      previousAcumProofComplexity: previousBlock.acumProofComplexity,
      previousHash: previousBlock.hash
    })
    this.pendingTransactions = []

    this.addBlock(newBlock, previousBlock)

    return newBlock
  }

  mergeJsonBranch = branchJSON => {
    /* merge it to current blockchain */
  }

  mergeBranch = branch => {
    /* merge it to current blockchain */
    let merged = false
    if (branch.length) {
      const firstBranchBlock = branch[0]
      const blockhcianBlock = this.blocks[firstBranchBlock.index - 1]
      const validationResult = Blockchain.validateBlock(
        firstBranchBlock,
        blockhcianBlock
      )
      if (validationResult.status) {
        db.set("blocks", [
          ...this.blocks.slice(0, firstBranchBlock.index),
          ...branch
        ]).write()
        merged = true
      }
    }
    return merged
  }

  getBalanceOfAddress = address => {
    /* Yes it weill never work in prodution */
    let balance = 0 // you start at zero!
    // Loop over each block and each transaction inside the block
    const blocks = this.blocks

    for (const block of blocks) {
      for (const trans of block.data.transactions) {
        // If the given address is the sender -> reduce the balance
        if (trans.from === address) {
          balance -= trans.amount
        }
        // If the given address is the receiver -> increase the balance
        if (trans.to === address) {
          balance += trans.amount
        }
      }
    }
    return balance
  }

  validateTransaction = (transaction, { isPending } = { isPending: false }) => {
    // Check the transaction
    if (transaction.from !== "network") {
      let balance = this.getBalanceOfAddress(transaction.from)
      if (isPending) {
        for (const trans of this.pendingTransactions) {
          // If the given address is the sender -> reduce the balance
          if (trans.from === trans.address) {
            balance -= trans.amount
          }
          // If the given address is the receiver -> increase the balance
          if (trans.to === trans.address) {
            balance += trans.amount
          }
        }
      }
      if (balance < transaction.amount) {
        return {
          status: false,
          type: "treatable",
          reason: "amount",
          message: "not enough coins"
        }
      }
    }

    return {
      status: true
    }
  }

  validateChain = () => {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]

      const result = this.validateBlock(currentBlock, previousBlock)
      if (result.status === false) {
        return {
          status: false
        }
      }
    }
    return {
      status: true
    }
  }

  serialize = () => {
    return JSON.stringify(this.blocks)
  }

  makeBlockFromJson = Blockchain.makeBlockFromJson

  static makeBlockFromJson = blockJsonData => {
    /* validate block */
    const transactions = blockJsonData.data.transactions.map(
      transactionJson => new Transaction({ ...transactionJson, transactions })
    )
    return new Block(blockJsonData)
  }

  validateBlock = (currentBlock, previousBlock) => {
    const that = this
    return Blockchain.validateBlock(currentBlock, previousBlock, {
      validateTransaction: this.validateTransaction
    })
  }

  static validateBlock = (
    currentBlock,
    previousBlock = null,
    options = {
      validateTransaction: null
    }
  ) => {
    if (currentBlock.hash !== currentBlock.makeHash()) {
      return {
        reason: "hash",
        status: false
      }
    }
    if (previousBlock) {
      if (currentBlock.previousHash !== previousBlock.hash) {
        return {
          reason: "previousHash",
          status: false
        }
      }
    }
    if (options.validateTransaction) {
      if (
        !currentBlock.data.transactions.every(
          transaction => options.validateTransaction(transaction).status
        )
      ) {
        return {
          reason: "transaction",
          status: false
        }
      }
    }
    return {
      status: true
    }
  }
}

export default Blockchain
