import React, { Component } from 'react'

import { Table } from 'antd'

const { Column } = Table

export default class BlocksExplorer extends Component {
  state = {
    blocks: []
  }

  componentDidMount() {
    this.updateBlocks()
  }

  updateBlocks = async () => {
    await fetch('//localhost:3000/blockchain/blocks')
      .then(res => res.json())
      .then(res => {
        this.setState({ blocks: res })
      })
  }

  render() {
    return (
      <Table
        style={{ backgroundColor: '#fff', ...this.props.style }}
        title={() => <h3 style={{ textAlign: 'left' }}>Blocks</h3>}
        size="small"
        rowKey="index"
        dataSource={this.state.blocks}
        expandedRowRender={record => (
          <pre>{JSON.stringify(record, null, 2)}</pre>
        )}
        pagination={{
          hideOnSinglePage: true
        }}
      >
        <Column title="Index" key="index" dataIndex="index" />
        <Column title="Hash" key="hash" dataIndex="hash" />
      </Table>
    )
  }
}
