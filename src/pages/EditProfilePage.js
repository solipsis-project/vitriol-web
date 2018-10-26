import React from 'react'
import { connect } from 'react-redux'
import { setMasterMetadata } from '../duck/users'
import PersonalInfoForm from '../PersonalInfoForm'

class EditProfilePage extends React.Component {
  
  handleSubmit = info => {
    this.props.dispatch(setMasterMetadata(info))
    const { history, location } = this.props
    if (location.state && location.state.internal) history.goBack()
    else this.props.history.push('/')
  }
  
  handleCancel = () => {
    const { history, location } = this.props
    console.log(location)
    if (location.state && location.state.internal) history.goBack()
    this.props.history.push('/')
  }
  
  render() {
    const { users } = this.props
    const masterUser = users.find(u => u.isMaster)    
    const hasMetadata = masterUser && masterUser.metadata && masterUser.metadata.size
    const { info, location, name } = hasMetadata ? masterUser.metadata.toObject() : {}
        
    return (
        <div className="Page">
          <PersonalInfoForm onSubmit={this.handleSubmit} onCancel={this.handleCancel} info={info} location={location} name={name} />
        </div>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedEditProfilePage = connect(mapStateToProps)(EditProfilePage)
export default ConnectedEditProfilePage
