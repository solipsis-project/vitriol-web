import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { addMasterArticle, setMasterMetadata } from '../duck/users'
import { insertDraft } from '../duck/drafts'
import Editor from '../Editor'
import ConfirmationModal from '../components/ConfirmationModal'

class WritePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { toSave: null }
  }
  
  doSave = () => {
    const { title, description, html } = this.state.toSave
    this.props.dispatch(addMasterArticle({title, description, text: html}))
    const { history, location } = this.props
    if (location.state && location.state.internal) history.goBack()
    else this.props.history.push('/')
  }
  
  hideConfirmation = () => this.setState({ toSave: null })
  
  handleSave = ({title, description, html}) => {
    if (!title || !html) return console.error('This should be a validation error: no title or no article')
    this.setState({ toSave: {title, description, html} })
  }
  
  handleSaveDraft = ({title, description, html}) => {
    if (!title || !html) return console.error('This should be a validation error: no title or no article')
    this.props.dispatch(insertDraft({title, description, text: html}))
    this.props.history.push('/drafts')
  }
  
  handleCancel = () => {
    const { history, location } = this.props
    if (location.state && location.state.internal) history.goBack()
    else this.props.history.push('/')
  }
  
  handleInfo = info => this.props.dispatch(setMasterMetadata(info))
  
  render () {
    const { readOnly, users } = this.props
    
    if (!readOnly) {
      const masterUser = users.find(u => u.isMaster)
      if (!masterUser || !masterUser.feed) return null
      if (!masterUser.metadata.size) return <Redirect to="/profile" />
    }
    
    return (
      <div className="FullPage">
        <Editor
          readOnly={readOnly}
          html={this.props.html}
          title={this.props.title}
          description={this.props.description}
          onCancel={this.handleCancel}
          onSaveDraft={this.handleSaveDraft}
          onSave={this.handleSave}
        />
        { this.state.toSave ?
            <ConfirmationModal 
              text="Do you really want to publish this article? It will be visible by anyone who has your feed address."
              buttons={(
                <React.Fragment>
                  <button className="Button Secondary" onClick={this.hideConfirmation}>Cancel</button>
                  <button className="Button Secondary" onClick={() => this.handleSaveDraft(this.state.toSave) }>Save as draft</button>
                  <button className="Button" onClick={this.doSave}>Publish</button>
                </React.Fragment>
              )} />
            : null } 
      </div>
     )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedWritePage = connect(mapStateToProps)(WritePage)
export default ConnectedWritePage