import React, { Component } from 'react'
import { FiBookmark } from 'react-icons/fi'
import './UserDetails.css'

class UserDetails extends Component {
  handlePinUser = () => {
    const { isPinned, onPin, onUnpin } = this.props
    isPinned ? onUnpin() : onPin()
  }
  
  render() {
    const { name, location, info, showEdit, onEdit, isPinned } = this.props
    const pinnedClass = `UserPinned ${isPinned ? 'pinned' : 'unpinned'}`
    return (
      <div className="UserDetails">
        <div className="UserDetailSection">
          <div className="UserName">
            { name }
          </div>
          <div className="UserLocation">
            { location }
          </div>
          <div className="UserInfo">
            { info }
          </div>
        </div>
        { !showEdit ? <FiBookmark className={pinnedClass} onClick={this.handlePinUser}/> : null }
        { showEdit ?
          <div onClick={onEdit} className="Button UserEdit">
            Edit
          </div>
        : null }
      </div>
    )
  }
}

export default UserDetails

