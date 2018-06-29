import SHA256 from "crypto-js/sha256"
import Joi from "joi"

class Block {
  constructor({
    index,
    timestamp,
    data,
    proof,
    previousAcumProofComplexity,
    previousHash = null,
    /* from json */
    acumProofComplexity
  }) {
    if (acumProofComplexity && previousAcumProofComplexity) {
      throw new Error(
        `you must provide either ${acumProofComplexity} or ${previousAcumProofComplexity} not both`
      )
    }
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.proof = proof
    this.acumProofComplexity = acumProofComplexity
      ? acumProofComplexity
      : this.proof + previousAcumProofComplexity
    this.previousHash = previousHash
    this.hash = this.makeHash()
  }

  makeHash = () => {
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
