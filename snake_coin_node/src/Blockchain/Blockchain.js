import Block from "./Block"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

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

  generateNextBlock = (data, proof) => {
    const previousBlock = this.latestBlock
    const newBlock = new Block({
      index: previousBlock.index + 1,
      timestamp: Date.now() / 1000,
      data: data,
      proof: proof,
      previousHash: previousBlock.hash
    })

    db.get("blocks")
      .push(newBlock)
      .write()

    return newBlock
  }

  isChainValid = () => {
    for (let i = 1; i < this.blocks.length; i++) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]

      if (currentBlock.hash !== currentBlock.hashBlock()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  getBalanceOfAddress = address => {
    let balance = 0 // you start at zero!
    // Loop over each block and each transaction inside the block
    const blocks = this.blocks
    console.log(blocks)
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

  checkTransaction(transaction, referenceBlockchain = this.blocks) {
    // Check the transaction

    return true
  }

  serialize = () => {
    return JSON.stringify(this.blocks)
  }
}

export default Blockchain
