import SHA256 from "crypto-js/sha256"

class Block {
  constructor({ index, timestamp, data, proof, previousHash = null }) {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.proof = proof
    this.previousHash = previousHash
    this.hash = this.doHash()
  }

  doHash = () => {
    return SHA256(
      this.index +
        this.previousHash +
        JSON.stringify(this.data) +
        this.timestamp
    ).toString()
  }

  serialize = () => {
    return JSON.stringify(this)
  }
}

export default Block
