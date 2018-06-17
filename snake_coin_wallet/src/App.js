import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { withRouter } from 'react-router'
import { LocaleProvider, Layout } from 'antd'
import en_US from 'antd/lib/locale-provider/en_US'
import { Provider } from 'mobx-react'
//app modules
import Header from 'src/_components/Header'
import BlocksExplorer from 'src/containers/BlocksExplorer'
import Controll from 'src/containers/Controll'
import rootStore from 'src/stores/root'
import classStyles from './App.module.css'

const { Content, Footer } = Layout

@withRouter
class ToLocaleProvider extends Component {
  render() {
    return (
      <Switch>
        <Route>
          <Switch>
            <Route
              path={'/blocks'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <Header />
                  <Content className={classStyles.content}>
                    <div style={{ display: 'flex' }}>
                      <BlocksExplorer style={{ flex: 1 }} {...props} />
                      <Controll {...props} style={{ minWidth: '28%' }} />
                    </div>
                  </Content>
                </Layout>
              )}
            />
            <Route exact path="/" render={props => <Redirect to="/blocks" />} />
          </Switch>
        </Route>
      </Switch>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Provider {...rootStore}>
        <Router>
          <LocaleProvider locale={en_US}>
            <ToLocaleProvider />
          </LocaleProvider>
        </Router>
      </Provider>
    )
  }
}

export default App
