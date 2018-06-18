import Main from './Main'

export class Root {
  constructor() {
    this.init()
  }

  init = async () => {
    this.mainStore = new Main()
    await this.mainStore.init()
  }
}

export default new Root()
