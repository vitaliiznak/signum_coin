import Block from "./Block"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
/* app modules */
import Transaction from "src/Blockchain/Transaction"

const adapter = new FileSync("data/db.json")
const db = low(adapter)
db.defaults({ blocks: [] }).write()

class Blockchain {
  constructor() {
    db.set("blocks", [this.createGenesisBlock()]).write()
    this.pendingTransactions = []
    this.miningReward = 100
  }

  get blocks() {
    return db.get("blocks").value()
  }

  get genesisBlock() {
    return db.get("blocks[0].title").value()
  }

  get latestBlock() {
    const blocks = db.get("blocks").value()
    return blocks[blocks.length - 1]
  }

  prevalidateTransaction = transaction => {
    // Check the transaction
    if (transaction.from !== "network") {
      let balance = this.getBalanceOfAddress(transaction.from)

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

      if (balance < transaction.amount) {
        return {
          status: false,
          type: "treatable",
          reason: "ammoun",
          message: "not enough coins"
        }
      }
    }

    return {
      status: true
    }
  }
  addPendingTransaction = data => {
    const txion = new Transaction({
      ...data
    })
    const { status, ...validationData } = this.prevalidateTransaction(txion)
    if (!status) {
      console.error(validationData.message)
      throw {
        status: false,
        ...validationData
      }
    }
    this.pendingTransactions.push(txion)
    return txion
  }

  createGenesisBlock() {
    return new Block({
      index: 0, //index
      timestamp: Date.now() / 1000, //timestamp
      data: {
        transactions: []
      }, //data
      proof: 9 //proof of work
    })
  }

  generateNextBlock = proof => {
    const previousBlock = this.latestBlock
    const newBlock = new Block({
      index: previousBlock.index + 1,
      timestamp: Date.now() / 1000,
      data: {
        transactions: this.pendingTransactions
      },
      proof: proof,
      previousHash: previousBlock.hash
    })
    this.pendingTransactions = []

    db.get("blocks")
      .push(newBlock)
      .write()

    return newBlock
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

  validateTransaction(transaction) {
    // Check the transaction
    if (transaction.from !== "network") {
      if (this.getBalanceOfAddress(transaction.from) < transaction.amount) {
        return {
          status: false,
          message: "not enough coins"
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

  validateChain = () => {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]

      if (currentBlock.hash !== currentBlock.doHash()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
      if (
        !currentBlock.transactions.every(
          transaction => this.validateTransaction(transaction).status
        )
      ) {
        return {
          status: false
        }
      }
    }
    return {
      status: true
    }
  }

  resolveConflicts = () => {
    /* to be implemented */
  }
}

export default Blockchain
