/* app modules */

import low from "lowdb"
import crypto from "crypto"
import FileSync from "lowdb/adapters/FileSync"
/* app modules */
import { CryptoUtils } from "src/utils/index"

const adapter = new FileSync("data/db.json")
const db = low(adapter)
db.defaults({ node: {} }).write()

class Node {
  constructor() {
    this.secret = crypto.randomBytes(Math.floor(64)).toString("hex")
    const keyPairRaw = CryptoUtils.generateKeyPairFromSecret(this.secret)
    this.keyPair = {
      privateKey: CryptoUtils.toHex(keyPairRaw.getSecret()),
      publicKey: CryptoUtils.toHex(keyPairRaw.getPublic())
    }
  }

  get address() {
    return this.keyPair.publicKey
  }

  get info() {
    return { address: this.keyPair.publicKey }
  }
}

export default Node
