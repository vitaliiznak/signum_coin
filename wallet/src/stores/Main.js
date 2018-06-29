import { observable, action, runInAction, ObservableMap } from 'mobx'

import config from 'config/index'
export class Main {
  constructor() {}

  @observable address = null
  @observable uri = null
  @observable nodes = []

  @observable blocks = []
  @observable balance = 0

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
    this.uri = nodeInfo.uri
  }

  @action
  updateNodesInfo = async () => {
    const nodesInfo = await fetch(`${config.apiURI}/nodes/uri`).then(res =>
      res.json()
    )
    this.nodes = nodesInfo
  }

  @action
  addNode = async values => {
    await fetch(`${config.apiURI}/nodes/uri`, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ ...values }),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow' // manual, *follow, error
    })
    await this.updateNodesInfo()
  }

  @action
  removeNode = async uri => {
    await fetch(`${config.apiURI}/nodes/uri/remove`, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ uri }),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow' // manual, *follow, error
    })
    await this.updateNodesInfo()
  }

  @action
  activateNode = async uri => {
    await fetch(`${config.apiURI}/nodes/uri/activate`, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ uri }),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow' // manual, *follow, error
    })
    await this.updateNodesInfo()
  }

  @action
  deactivateNode = async uri => {
    await fetch(`${config.apiURI}/nodes/uri/deactivate`, {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ uri }),
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow' // manual, *follow, error
    })
    await this.updateNodesInfo()
  }

  @action
  mine = async () => {
    await fetch(`${config.apiURI}/blockchain/mine`, {
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

  @action
  transaction = async transactionData => {
    return fetch(`${config.apiURI}/blockchain/transaction`, {
      body: JSON.stringify({
        from: this.address,
        ...transactionData
      }), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, cors, *same-origin
      redirect: 'follow', // manual, *follow, error,
      referrer: 'no-referrer' // *client, no-referrer
    })
  }

  init = async () => {
    await Promise.all([this.updateNodeInfo(), this.updateBlocks()])
    await this.updateBalance()
  }
}

export default Main
