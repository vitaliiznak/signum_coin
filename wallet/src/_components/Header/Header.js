import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom'
//app modules

import cssClasses from './Header.module.css'

// import UserAcionsMenu from 'src/_components/UserActionsMenu'

@withRouter
class Header extends Component {
  render() {
    return (
      <div>
        <div className={cssClasses.index}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NavLink
              to={`/blocks`}
              className={cssClasses.navLink}
              activeClassName={cssClasses.navLinkActive}
            >
              Blocks Explorer
            </NavLink>
          </div>
          {/* <UserAcionsMenu /> */}
        </div>
      </div>
    )
  }
}

export default Header
