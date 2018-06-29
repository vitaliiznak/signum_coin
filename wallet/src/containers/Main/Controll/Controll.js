import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Button, Card } from 'antd'
//app modules
import Transaction from './Transaction'
import config from 'config/index'

@inject('mainStore')
@observer
export default class Actions extends Component {
  componentDidMount() {
    this.props.mainStore.updateNodesInfo()
  }

  render() {
    const { style, mainStore } = this.props
    return (
      <div style={{ overflowY: 'auto', padding: '0 10px', ...style }}>
        <div>
          <Card style={{ marginBottom: '10px' }} title="Your Wallet">
            <h4 />
            <div
              style={{
                lineBreak: 'auto',
                overflowWrap: 'break-word',
                fontSize: '11px'
              }}
            >
              {mainStore.address}
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ marginTop: '17px' }}>
                You have{' '}
                <span
                  style={{
                    fontSize: '18px',
                    color: 'green',
                    fontWeight: '700'
                  }}
                >
                  {mainStore.balance}
                </span>{' '}
                coins
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: '10px' }} title="Transaction">
            <Transaction />
          </Card>
        </div>
      </div>
    )
  }
}
