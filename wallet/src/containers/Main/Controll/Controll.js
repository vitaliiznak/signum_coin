import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Card } from 'antd'
//app modules
import Transaction from './Transaction'
import config from 'config/index'

@inject('mainStore')
@observer
export default class Actions extends Component {
  onMine = e => {
    this.props.mainStore.mine()
  }

  componentDidMount() {}

  render() {
    const { style, mainStore } = this.props

    return (
      <div style={{ overflowY: 'auto', padding: '4px 10px', ...style }}>
        <div>
          <Card style={{ marginBottom: '10px' }}>
            <h4>All nodes in a blockchain</h4>
            <div style={{ lineBreak: 'auto', overflowWrap: 'break-word' }}>
              {mainStore.address}
            </div>
          </Card>
          <Card style={{ marginBottom: '10px' }}>
            <h4>Your Address</h4>
            <div style={{ lineBreak: 'auto', overflowWrap: 'break-word' }}>
              {mainStore.address}
            </div>
          </Card>
          <Card style={{ marginBottom: '10px' }}>
            <h4>Your Coins Amount</h4>
            <div>{mainStore.balance}</div>
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
