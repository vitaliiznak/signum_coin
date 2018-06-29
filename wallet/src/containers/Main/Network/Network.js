import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import {
  Button,
  Card,
  Table,
  Form,
  Input,
  Modal,
  notification,
  Tooltip
} from 'antd'
import url from 'url'
//app modules
const { Column } = Table
const { Item: FormItem } = Form

@inject('mainStore')
@observer
@Form.create()
class AddPeer extends Component {
  handleSubmit = ev => {
    ev.preventDefault()
    this.props.form.validateFieldsAndScroll(null, async (errors, values) => {
      if (errors) {
        return
      }
      const { uri } = values
      const { host } = url.parse(uri || '', false, true)
      await this.props.mainStore.addNode({ uri: `//${host}` })
    })
  }

  validateUri = (rule, value, callback) => {
    const { host } = url.parse((value || '').trim(), false, true)
    if (!host || !host.length) {
      return callback(true)
    }
    callback()
  }

  validateUriUnique = (rule, value, callback) => {
    const { host } = url.parse((value || '').trim(), false, true)
    const { nodes } = this.props
    if (nodes.some(node => node.uri === `//${host}`)) {
      return callback(true)
    }
    callback()
  }

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props
    return (
      <Card style={{ marginTop: '10px' }} title="Add node to a network">
        <Form onSubmit={this.handleSubmit}>
          <Tooltip
            placement="topLeft"
            title="Provide a URI of a peer you want to add to a network"
            arrowPointAtCenter
          >
            <FormItem>
              {getFieldDecorator('uri', {
                rules: [
                  {
                    required: true,
                    message: 'Please input a valid uri!',
                    validator: this.validateUri
                  },
                  {
                    message: 'this uri is already in the set!',
                    validator: this.validateUriUnique
                  }
                ]
              })(
                <Input
                  placeholder="ex. //localhost:3001
            "
                />
              )}
            </FormItem>
          </Tooltip>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" htmlType="submit" ghost>
              Add
            </Button>
          </div>
        </Form>
      </Card>
    )
  }
}

@inject('mainStore')
@observer
export default class Network extends Component {
  static notificationKey = 'key'

  onMine = async e => {
    await this.props.mainStore.mine()
    const blockNumber = this.props.mainStore.blocks.length - 1
    notification['success']({
      key: Network.notificationKey,
      message: `Mined block ${blockNumber}`,
      description: 'block was succesfully mined',
      placement: 'bottomLeft',
      duration: 2,
      style: {
        border: '2px solid green'
      }
    })
    // Modal.success({
    //   title: 'Mined',
    //   content: 'block was succesfully mined'
    // })
  }

  onRemoveNode = uri => {
    this.props.mainStore.removeNode(uri)
  }
  onDeactivateNode = uri => {
    this.props.mainStore.deactivateNode(uri)
  }

  onActivateNode = uri => {
    this.props.mainStore.activateNode(uri)
  }

  componentDidMount() {
    this.props.mainStore.updateNodesInfo()
  }

  render() {
    const { style, mainStore } = this.props
    const { uri: thisUri } = mainStore
    return (
      <div style={{ overflowY: 'auto', padding: '0 10px', ...style }}>
        <Card style={{ marginBottom: '10px' }} title="Node Controll">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="primary"
              style={{ flex: 1, margin: '0 4px' }}
              onClick={this.onMine}
              ghost
            >
              Mine
            </Button>
          </div>
        </Card>
        <AddPeer nodes={mainStore.nodes.slice()} />
        <div style={{ height: '10px' }} />
        <Card style={{ paddingTop: '5px' }} title="Node's URIs in a network">
          <Table
            rowKey="uri"
            dataSource={mainStore.nodes.slice()}
            pagination={{ hideOnSinglePage: true }}
            expandedRowRender={record => (
              <p style={{ margin: 0 }}>{record.uri}</p>
            )}
            className="tableNoHead"
          >
            <Column key="index" render={(uri, record, index) => index} />
            <Column
              key="uri"
              dataIndex="uri"
              render={(uri, record, index) => {
                return (
                  <Fragment>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontWeight: '700', marginBottom: '10px' }}>
                        {uri}
                      </span>
                    </div>
                    <div
                      style={{
                        justifyContent: 'flex-end',
                        paddingTop: '7px'
                      }}
                    >
                      {thisUri === uri && (
                        <div style={{ textAlign: 'center', fontSize: '19px' }}>
                          this is you!
                        </div>
                      )}
                      {thisUri !== uri && (
                        <Fragment>
                          {Boolean(record.active) ? (
                            <Tooltip
                              placement="topLeft"
                              title="Notify this peer about new transactions and mined blocks "
                              arrowPointAtCenter
                            >
                              <Button
                                onClick={() => this.onDeactivateNode(uri)}
                                style={{
                                  width: '100%',
                                  marginBottom: '17px',
                                  color: 'green',
                                  borderColor: 'green'
                                }}
                                type="danger"
                                ghost
                                size="small"
                              >
                                Notifiable Peer
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              placement="topLeft"
                              title="Do Not notify this peer about new transactions and mined blocks "
                              arrowPointAtCenter
                            >
                              <Button
                                onClick={() => this.onActivateNode(uri)}
                                style={{
                                  width: '100%',
                                  marginBottom: '17px',

                                  color: '#ef6c00 ',
                                  borderColor: '#e65100'
                                }}
                                type="danger"
                                ghost
                                size="small"
                              >
                                Not Notifiable Peer
                              </Button>
                            </Tooltip>
                          )}
                          <Button
                            style={{ width: '100%', marginBottom: '17px' }}
                            onClick={() => this.onRemoveNode(uri)}
                            type="danger"
                            ghost
                            size="small"
                          >
                            Remove
                          </Button>
                        </Fragment>
                      )}
                    </div>
                  </Fragment>
                )
              }}
            />
          </Table>
        </Card>
      </div>
    )
  }
}
