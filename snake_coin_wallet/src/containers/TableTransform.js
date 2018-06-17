import React, { Component } from 'react'

import { Table, Icon, Divider } from 'antd'

//app modules
import FormulaBuilder from './FormulaBuilder'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="javascript:;">Action 一 {record.name}</a>
        <Divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <Divider type="vertical" />
        <a href="javascript:;" className="ant-dropdown-link">
          More actions <Icon type="down" />
        </a>
      </span>
    )
  }
]

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <FormulaBuilder />
        <div style={{ display: 'flex', padding: '0 20px' }}>
          <Table
            columns={columns}
            dataSource={data}
            style={{ margin: '0 20px' }}
          />
          <Table
            columns={columns}
            dataSource={data}
            style={{ margin: '0 20px' }}
          />
        </div>
      </div>
    )
  }
}
