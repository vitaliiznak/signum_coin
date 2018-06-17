import SHA256 from "crypto-js/sha256"

class Transaction {
  constructor({ from, to, amount }) {
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
}

export default Transaction
