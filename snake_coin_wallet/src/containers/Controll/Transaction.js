import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Form, InputNumber, Input, Button } from 'antd'

/* app modules */

const { Item: FormItem } = Form

@inject('mainStore')
@observer
@Form.create()
export default class NormalLoginForm extends React.Component {
  handleSubmit = ev => {
    ev.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        console.error('Received values of form: ', values)
        return
      }
      const { mainStore } = this.props
      fetch('//localhost:3000/blockchain/transaction', {
        body: JSON.stringify({
          from: mainStore.address,
          ...values
        }), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error,
        referrer: 'no-referrer' // *client, no-referrer
      })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {/* <FormItem>
          {getFieldDecorator('from', {
            rules: [{ required: true, message: 'Please input from address!' }]
          })(<Input placeholder="from" />)}
        </FormItem> */}
        <FormItem>
          {getFieldDecorator('to', {
            rules: [{ required: true, message: 'Please input to  address!' }]
          })(<Input placeholder="to" />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('amount', {
            rules: [{ required: true, message: 'Please input an ammount!' }],
            initialValue: 1
          })(<InputNumber min={1} max={10} />)}
        </FormItem>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Send
          </Button>
        </div>
      </Form>
    )
  }
}
