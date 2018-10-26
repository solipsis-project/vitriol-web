import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { FiGitlab, FiBook } from 'react-icons/fi'
import Logo from '../components/Logo'
import './HomePage.css'

class HomePage extends React.Component {
  render() {        
    return (
      <div className="Page">
        <div className="HomePage">
          <div className="LogoName">
            <span>V</span><span>I</span><span>T</span><span>R</span><span>I</span><span>O</span><span>L</span>
          </div>
          <Logo strokeWidth={2} />
          <p className="Blurb">Distributed, serverless publishing platform.</p>
          <div className="Links">
            <Link className="Link" to="https://google.com"><FiBook /> <span className="LinkText">Read the user intro</span></Link>
            <a className="Link" href="https://google.com"><FiGitlab /> <span className="LinkText">Read the code</span></a>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedHomePage = connect(mapStateToProps)(HomePage)
export default ConnectedHomePage
