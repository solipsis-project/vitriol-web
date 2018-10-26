import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { loadMaster, init } from './duck/users'
import { initDrafts } from './duck/drafts'
import ConfirmationModal from './components/ConfirmationModal'
import Header from './pages/Header'
import FeedPage from './pages/FeedPage'
import WritePage from './pages/WritePage'
import HomePage from './pages/HomePage'
import ArticlePage from './pages/ArticlePage'
import DraftPage from './pages/DraftPage'
import DraftEditorPage from './pages/DraftEditorPage'
import TrackedPage from './pages/TrackedPage'
import EditProfilePage from './pages/EditProfilePage'
import WriteFloatingButton from './components/WriteFloatingButton'

class Routes extends Component {
  constructor(props){
    super(props)
    props.dispatch(init())
    props.dispatch(initDrafts())
    props.dispatch(loadMaster())
  }
  
  render() {    
    if (this.props.error.unrecoverable) return (
        <ConfirmationModal 
          text="There has been an unrecoverable error connecting to IPFS. Please retry again later."
          buttons={(
            <React.Fragment>
              <button className="Button" onClick={() => window.location.reload(true)}>Refresh</button>
            </React.Fragment>
          )} />
      )
    
    return (
        <BrowserRouter>
          <Route component={View} />
        </BrowserRouter>
    )
  }
}

function View({ location }) {
  return (
    <div className="View">
      <Route component={Header} />
      <div className="Content">
        <Switch>
          <Route exact component={withWriteButton(HomePage)} path="/home" />
          <Route exact component={withWriteButton(DraftPage)} path="/drafts" />
          <Route exact component={WritePage} path="/write" />
          <Route exact component={withWriteButton(TrackedPage)} path="/connections" />
          <Route exact component={withWriteButton(EditProfilePage)} path="/profile" />
          <Route exact component={DraftEditorPage} path="/drafts/:draftHash" />
          <Route exact component={withWriteButton(FeedPage)} path="/:userHash/" />
          <Route exact component={ArticlePage} path="/:userHash/:articleHash" />
          <Route component={() => <Redirect to="/home" />} />
        </Switch>
      </div>
    </div>
  )
}

function withWriteButton(Component) {
  return (props) => <React.Fragment><WriteFloatingButton /><Component {...props}/></React.Fragment>
}

function mapStateToProps({ users, error }) {
  return { users, error }
}

const ConnectedRoutes = connect(mapStateToProps)(Routes)
export default ConnectedRoutes
