import { observable, action, runInAction, ObservableMap } from 'mobx'
import uuidv4 from 'uuid/v4'

import config from 'config/index'
export class Main {
  constructor() {}

  @observable address = uuidv4()

  @observable blocks = []
  @observable balance = null

  @action
  updateBlocks = async () => {
    await fetch(`${config.apiURI}/blockchain/blocks`)
      .then(res => res.json())
      .then(res => {
        this.blocks = res.reverse()
      })
  }
  @action
  updateBalance = async () => {
    const balanseInfo = await fetch(
      `${config.apiURI}/blockchain/balance/${this.address}`
    ).then(res => res.json())
    this.balance = balanseInfo.balance
  }

  @action
  updateNodeInfo = async () => {
    const nodeInfo = await fetch(`${config.apiURI}/nodes/me`).then(res =>
      res.json()
    )
    this.address = nodeInfo.address
  }

  @action
  mine = async () => {
    await fetch(`${config.apiURI}/blockchain/mine/${this.address}`, {
      headers: {
        'content-type': 'application/json'
      },
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow' // manual, *follow, error
    })
    await this.updateBlocks()
    await this.updateBalance()
  }

  @action transaction = async e => {}

  init = async () => {
    await Promise.all([this.updateNodeInfo(), this.updateBlocks()])
    await this.updateBalance()
  }
}

export default Main
