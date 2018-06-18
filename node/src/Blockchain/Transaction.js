import SHA256 from "crypto-js/sha256"
import crypto from "crypto"
//app moodules

class Transaction {
  constructor({ from, to, amount }) {
    this.id = crypto.randomBytes(Math.floor(64)).toString("hex")
    this.from = from
    this.to = to
    this.amount = amount
    this.hash = this.hash()
  }

  hash = () => {
    return SHA256(this.from + this.to + this.amount).toString()
  }

  serialize = () => {
    return JSON.stringify(this)
  }

  // check = () => {
  //   return true
  // }
}

export default Transaction
