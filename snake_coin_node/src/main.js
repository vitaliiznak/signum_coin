import Blockchain from "./Blockchain"
import Block from "./Block"

function test() {
  const blockchain = new Blockchain()
  blockchain.nextBlock(new Block(1, "20/07/2017", { amount: 4 }))
  blockchain.nextBlock(new Block(2, "20/07/2017", { amount: 8 }))

  console.log(blockchain, null, 4)
}

test()
