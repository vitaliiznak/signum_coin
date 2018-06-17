import React, { Component, Fragment } from 'react'

import { Radio, Table, Icon, Divider, Select, Input, Form, Button } from 'antd'
//app modules

//co0nstants
const Option = Select.Option
const { Button: RadioButton, Group: RadioGroup } = Radio

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    type: 'string'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    type: 'number'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    type: 'string'
  },
  {
    title: 'Action',
    key: 'action',
    type: null
  }
]

@Form.create()
export default class FormBuilder extends Component {
  state = {
    name: '',
    formula: [],
    operatorOperandSelector: 'operator'
  }

  onSpecChanged = ev => {
    this.props.onSpecChanged({
      name: this.state.name,
      formula: this.state.formula
    })
  }

  onOperatorOrOperand = ev => {
    this.setState({ name: ev.target.value })
  }

  handleSubmit = ev => {
    console.log(ev)
  }

  addToFormula = el => {
    console.log(el)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { autoCompleteResult } = this.state
    return (
      <div className="App" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <div>Column name</div>
            <Input placeholder="Column name" />
          </div>
          <div style={{ marginTop: '20px' }}>Transformation formula</div>
          <div style={{ display: 'flex', padding: '0 0' }}>
            <div>
              <RadioGroup
                defaultValue={this.state.operatorOperandSelector}
                onChange={this.onOperatorOrOperand}
              >
                <RadioButton value="operator">Operator</RadioButton>
                <RadioButton value="operand">Operand</RadioButton>
              </RadioGroup>
              <Select
                defaultValue={columns[0].key}
                style={{ width: 120 }}
                // onChange={handleChange}
              >
                {columns.map(el => (
                  <Option
                    key={el.key}
                    value={el.key}
                    title={`${el.title} | <${el.type}>`}
                  >
                    <div>{el.title}</div>
                    <div>{`<${el.type}>`}</div>
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={this.addToFormula}>
                Add to formula
              </Button>
            </div>
          </div>Current formula<div />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%'
            }}
          >
            <Button type="primary" htmlType="submit">
              Add Column
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}
