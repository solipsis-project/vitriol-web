import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import Logo from '../components/Logo'
import './Header.css'

class Header extends Component {
  render() {
    const masterUser = this.props.users.find(u => u.isMaster)
    const masterHash = masterUser ? masterUser.hash : null
    const hasProfile = masterUser && masterUser.metadata && masterUser.metadata.size
      
    const toProfile = hasProfile ? `/${masterHash}` : '/profile'
    
    return (
      <div className="HeaderContainer">
        <div className="Header">
          <Logo className="HeaderLogo" />
          <NavLink activeClassName="current" className="ButtonTab" to="/home">Home</NavLink>{' '}
          <NavLink activeClassName="current" className={`ButtonTab ${!masterHash ? 'disabled': ''}`} to={{ pathname: toProfile, state: { internal: true }}}>You</NavLink>{' '}
          <NavLink activeClassName="current" className="ButtonTab" to={'/drafts'}>Drafts</NavLink>{' '}
          <NavLink activeClassName="current" className="ButtonTab" to="/connections">Feeds</NavLink>{' '}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ users,  notifications }) {
  return { users,  notifications }
}

const ConnectedHeader = connect(mapStateToProps)(Header)
export default ConnectedHeader