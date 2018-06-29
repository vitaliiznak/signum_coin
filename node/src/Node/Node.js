import url from "url"
/* app modules */

import low from "lowdb"
import crypto from "crypto"
import filenamify from "filenamify"

import FileSync from "lowdb/adapters/FileSync"
/* app modules */
import { CryptoUtils } from "src/utils/index"
import config from "config/index"

const adapter = new FileSync(`data/${filenamify(config.uri)}_db.json`)
let db = low(adapter)
db.defaults({
  node: { uri: config.uri },
  peers: config.peers.map(uri => ({ uri: uri, active: true }))
}).write()
db.readDb = () => {
  return low(adapter) //to liste on changes in fileitself
}

class Node {
  constructor() {
    this.secret = crypto.randomBytes(Math.floor(64)).toString("hex")
    const keyPairRaw = CryptoUtils.generateKeyPairFromSecret(this.secret)
    this.keyPair = {
      privateKey: CryptoUtils.toHex(keyPairRaw.getSecret()),
      publicKey: CryptoUtils.toHex(keyPairRaw.getPublic())
    }
    /* write to a database */
  }

  get address() {
    return this.keyPair.publicKey
  }

  get uri() {
    return config.uri
  }

  get info() {
    return { address: this.keyPair.publicKey, uri: config.uri }
  }

  get knownPeers() {
    return db
      .readDb()
      .get("peers")
      .value()
  }

  addUri = uri => {
    const foundValue = db
      .readDb()
      .get("peers")
      .find({ uri })
      .value()
    if (foundValue) {
      return foundValue
    }
    return db
      .readDb()
      .get("peers")
      .push({ uri })
      .write()
  }

  removeUri = uri => {
    const foundValue = db
      .readDb()
      .get("peers")
      .remove({ uri })
      .write()
  }

  deactivatePeer = uri => {
    return db
      .readDb()
      .get("peers")
      .find({ uri })
      .assign({ active: false })
      .write()
  }

  activatePeer = uri => {
    return db
      .readDb()
      .get("peers")
      .find({ uri })
      .assign({ active: true })
      .write()
  }
}

export default Node
