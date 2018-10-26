import React from 'react'
import { connect } from 'react-redux'
import { addMasterArticle } from '../duck/users'
import { deleteDraft, replaceDraft } from '../duck/drafts'
import FullPageLoader from '../components/FullPageLoader'
import Editor from '../Editor'

class DraftEditorPage extends React.Component {
  handleSave = ({title, description, html}) => {
    const { draftHash } = this.props.match.params
    if (!title || !html) return console.error('This should be a validation error: no title or no article')
    this.props.dispatch(addMasterArticle({title, description, text: html}))
    this.props.dispatch(deleteDraft(draftHash))
    this.props.history.goBack()
  }
  
  handleSaveDraft = ({title, description, html}) => {
    const { draftHash } = this.props.match.params
    if (!title || !html) return console.error('This should be a validation error: no title or no article')
    this.props.dispatch(replaceDraft(draftHash, {title, description, text: html}))
    this.props.history.goBack()
  }
  
  handleCancel = () => {
    this.props.history.goBack()
  }
  
  render() {
    const { draftHash } = this.props.match.params
    const draftList = this.props.drafts.get('draftList')
    
    if (!draftList || !draftList.size) return <FullPageLoader text="Loading article..." />
    
    const draft = draftList.find(d => d.createdAt.toString() === draftHash)
    if (!draft) return <p>Draft not found</p>
    
    return (<div className="FullPage">
              <Editor
                draftId={draftHash}
                title={draft.title}
                description={draft.description}
                html={draft.text}
                onCancel={this.handleCancel}
                onSaveDraft={this.handleSaveDraft}
                onSave={this.handleSave}
              />
            </div>)
  }
}

function mapStateToProps({ drafts }) {
  return { drafts }
}

const ConnectedDraftEditorPage = connect(mapStateToProps)(DraftEditorPage)
export default ConnectedDraftEditorPage