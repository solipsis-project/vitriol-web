import React from 'react'
import { connect } from 'react-redux'
import { deleteDraft } from '../duck/drafts.js'
import CardList from '../CardList'
import EmptyList from '../EmptyList'
import ConfirmationModal from '../components/ConfirmationModal'
import './DraftPage.css'

class DraftPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { toDelete: null }
  }
  
  handleDelete = id => this.setState({ toDelete: id })

  removeDraft = () => {
    this.props.dispatch(deleteDraft(this.state.toDelete))
    this.hideConfirmation()
  }

  hideConfirmation = () => this.setState({ toDelete: null })

  render() {
    const draftList = this.props.drafts.get('draftList')
    
    return (
      <div className="DraftPage Page">
      {
        draftList.size ?
        <CardList
          articleList={draftList}
          linkFormatter={a => `/drafts/${a.createdAt}`}
          authorFormatter={() => 'Draft'}
          onDelete={a => this.handleDelete(a.createdAt)}
        /> :
        <EmptyList isMaster={true}/>
      }
      { this.state.toDelete ?
          <ConfirmationModal 
            text="Do you really want to remove this draft?"
            buttons={(
              <React.Fragment>
                <button className="Button Secondary" onClick={this.hideConfirmation}>Cancel</button>
                <button className="Button Alert" onClick={this.removeDraft}>Remove</button>
              </React.Fragment>
            )} />
          : null } 
      </div>
    )
  }
}

function mapStateToProps({ drafts }) {
  return { drafts }
}

const ConnectedDraftPage = connect(mapStateToProps)(DraftPage)
export default ConnectedDraftPage