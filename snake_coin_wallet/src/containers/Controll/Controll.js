import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Card } from 'antd'
//app modules
import Transaction from './Transaction'

@inject('mainStore')
@observer
export default class Actions extends Component {
  onMine = e => {
    const { address } = this.props.mainStore
    fetch(`//localhost:3000/blockchain/mine/${address}`, {
      headers: {
        'content-type': 'application/json'
      },
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      redirect: 'follow', // manual, *follow, error
      body: null
    })
  }
  render() {
    const { style, mainStore } = this.props
    return (
      <div style={{ overflowY: 'auto', padding: '4px 10px', ...style }}>
        <div>
          <Card style={{ marginBottom: '10px' }}>
            <h4>Address</h4>
            <div>{mainStore.address}</div>
          </Card>
          <Card style={{ marginBottom: '10px' }}>
            <h4>Ammount</h4>
            <div>{mainStore.address}</div>
          </Card>
          <Card style={{ marginBottom: '10px' }}>
            <Transaction />
          </Card>
        </div>
        <div>
          <Card style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                type="primary"
                style={{ flex: 1, margin: '0 4px' }}
                onClick={this.onMine}
                ghost
              >
                Mine
              </Button>
              <Button
                type="primary"
                style={{ flex: 1, margin: '0 4px' }}
                onClick={this.onMine}
                ghost
              >
                Consensus
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
