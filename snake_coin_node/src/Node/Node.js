/* app modules */

import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
/* app modules */
import { CryptoUtils } from "src/utils/index"
import uuidv4 from "uuid/v4"

const adapter = new FileSync("data/db.json")
const db = low(adapter)
db.defaults({ node: {} }).write()

class Node {
  constructor() {
    this.id = null
    this.secret = uuidv4()
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
