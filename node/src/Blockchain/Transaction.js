import SHA256 from "crypto-js/sha256"
import crypto from "crypto"
import { serialize } from "serializr"
//app moodules

class Transaction {
  constructor({
    id = crypto.randomBytes(Math.floor(64)).toString("hex"),
    from,
    hash,
    to,
    amount
  }) {
    this.id = id
    this.from = from
    this.to = to
    this.amount = amount
    this.hash = hash || this.hash()
  }

  hash = () => {
    return SHA256(this.id + this.from + this.to + this.amount).toString()
  }

  serialize = () => {
    return JSON.stringify(this)
  }
}

export default Transaction
