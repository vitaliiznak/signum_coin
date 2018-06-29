import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, InputNumber, Input, Button, Select, Modal } from 'antd'
import validator from 'validator'

/* app modules */
const { Item: FormItem } = Form

@inject('mainStore')
@Form.create()
@observer
export default class NormalLoginForm extends React.Component {
  validateAddress = (rule, value, callback) => {
    if (value.trim().length !== 64 || !validator.isHexadecimal(value.trim())) {
      return callback(true)
    }
    callback()
  }

  validateAmount = (rule, value, callback) => {
    const {
      mainStore: { balance }
    } = this.props
    if (balance < value) {
      return callback(true)
    }
    callback()
  }

  handleSubmit = ev => {
    ev.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.error('Received values of form: ', values)
        return
      }
      const { mainStore } = this.props.mainStore
        .transaction(values)
        .then(res => {
          if (res.ok) {
            Modal.success({
              title: 'Transaction send',
              content: (
                <span>
                  Transaction is in the pending queue, you must click Mine at
                  one of the nodes in order to put it intoa blockchain
                </span>
              )
            })
          }
          return res
        })
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      mainStore
    } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label={'Address to send'}>
          {getFieldDecorator('to', {
            rules: [
              { required: true, message: 'Please provide an address!' },
              {
                message: 'Is not a valid address!',
                validator: this.validateAddress
              }
            ],
            initialValue: ''
          })(
            <Input
              placeholder="ex. a6c2d60ce389ca56ed83da809494fbf4bf9b02f4f15a5627c110c59271006932
          "
            />
          )}
        </FormItem>
        {/* <FormItem label={'Address to send'}>
          {getFieldDecorator('toUri', {
            rules: [{ required: true, message: 'Please input an amountt!' }],
            initialValue: mainStore.nodes.slice().length
              ? mainStore.nodes.slice()[0]
              : null
          })(
            <Select>
              {mainStore.nodes.slice().map(address => (
                <Option key={address} value={address}>
                  {address}
                </Option>
              ))}
            </Select>
          )}
        </FormItem> */}
        <FormItem label={'Amount to send'}>
          {getFieldDecorator('amount', {
            rules: [
              {
                required: true,
                message: 'Please input an amountt!'
              },
              {
                message: 'you do not have enough coins to send',
                validator: this.validateAmount
              }
            ],
            initialValue: 1
          })(<InputNumber style={{ width: '100%' }} min={1} />)}
          {/* <div style={{ fontSize: '11px' }}>
            (you can not select more than you have
          </div> */}
        </FormItem>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="primary" htmlType="submit" ghost>
            Send
          </Button>
        </div>
      </Form>
    )
  }
}

// ;<Card style={{ marginBottom: '10px' }}>
//   <h4>All nodes in a blockchain</h4>
//   <div style={{ lineBreak: 'auto', overflowWrap: 'break-word' }}>
//     {mainStore.nodes.map(el => <div>{el}</div>)}
//   </div>
// </Card>
