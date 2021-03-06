import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Table } from 'antd'

/* app modeules */
import config from 'config/index'

const { Column } = Table

@inject('mainStore')
@observer
export default class BlocksExplorer extends Component {
  state = {
    blocks: []
  }

  componentDidMount() {
    this.props.mainStore.updateBlocks()
  }

  render() {
    const { blocks } = this.props.mainStore
    return (
      <Table
        style={{ backgroundColor: '#fff', ...this.props.style }}
        title={() => <h3 style={{ textAlign: 'left' }}> Blocks Explorer</h3>}
        size="small"
        rowKey="index"
        dataSource={blocks.slice()}
        expandedRowRender={record => (
          <div style={{ overflow: 'auto', maxWidth: '400px', resize: 'none' }}>
            <pre style={{ overflow: 'auto', resize: 'none' }}>
              {JSON.stringify(record, null, 2)}
            </pre>
          </div>
        )}
        pagination={{
          hideOnSinglePage: true
        }}
      >
        <Column
          title="Index"
          key="index"
          dataIndex="index"
          render={(value, record) => (
            <div
              style={{
                minWidth: '35px'
              }}
            >
              {value}
            </div>
          )}
        />
        <Column
          title="Hash"
          key="hash"
          dataIndex="hash"
          render={(value, record) => (
            <div
              style={{
                maxWidth: '240px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {value}
            </div>
          )}
        />
      </Table>
    )
  }
}
