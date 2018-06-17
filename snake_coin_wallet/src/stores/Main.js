import { observable, action, runInAction, ObservableMap } from 'mobx'
import uuidv4 from 'uuid/v4'

export class Main {
  constructor() {}

  @observable address = uuidv4()

  init = async () => {
    const nodeInfo = await fetch('http://localhost:3000/node').then(res =>
      res.json()
    )
    this.address = nodeInfo.address
  }
}

export default Main
