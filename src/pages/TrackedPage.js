import React, { Component } from 'react'
import { connect } from 'react-redux'
import { UserList } from '../UserList'
import './TrackedPage.css'

class TrackedPage extends Component {
  render() {
    const pinnedUsers = this.props.users.filter(u => u.pinned)
    const unpinnedUsers = this.props.users.filter(u => !u.pinned && !u.isMaster)
    return (
      <div className="Page">
        <div className="TrackedPage">
          <p className="TrackedTitle">Feeds you've pinned:</p>
          { pinnedUsers.size ?
            <React.Fragment>
              <UserList users={pinnedUsers} />
            </React.Fragment>
            : <p className="EmptyPlaceHolder">There seems to be nothing here.</p>
          }
          <p className="TrackedTitle">Feeds you track in this session:</p>
          { unpinnedUsers.size ?
            <React.Fragment>
              <UserList users={unpinnedUsers} />
            </React.Fragment>
            : <p className="EmptyPlaceHolder">There seems to be nothing here.</p>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedTrackedPage = connect(mapStateToProps)(TrackedPage)
export default ConnectedTrackedPage

