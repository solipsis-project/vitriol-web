import React, { Component } from 'react'
import { connect } from 'react-redux'
import { load, pin, advanceFeedPage, deleteMasterArticle } from '../duck/users'
import UserDetails from '../UserDetails'
import CardList from '../CardList'
import EmptyList from '../EmptyList'
import InvalidAddress from '../InvalidAddress'
import FullPageLoader from '../components/FullPageLoader'
import ConfirmationModal from '../components/ConfirmationModal'
import ShareProfile from '../components/ShareProfile'
import './FeedPage.css'

class FeedPage extends Component {
  constructor(props) {
    super(props)
    const { userHash } = this.props.match.params
    if (!props.users.get(userHash)) {
      props.dispatch(load(userHash))
    }
    this.state = { toDelete: null }
  }

  handleDelete = id => this.setState({ toDelete: id })

  removeArticle = () => {
    this.props.dispatch(deleteMasterArticle(this.state.toDelete))
    this.hideConfirmation()
  }

  hideConfirmation = () => this.setState({ toDelete: null })

  handlePin = () => this.props.dispatch(pin(this.props.match.params.userHash, true))

  handleUnpin = () => this.props.dispatch(pin(this.props.match.params.userHash, false))

  handleMore = () => this.props.dispatch(advanceFeedPage(this.props.match.params.userHash))

  handleProfileEdit = () => this.props.history.push('/profile', { internal: true })

  render() {
    const { userHash } = this.props.match.params
    //const { userHash } = this.props.location.search
    const currentUser = this.props.users.get(userHash)

    if (!global.OrbitDB.isValidAddress(`/orbitdb/${userHash}/user`)) return (<InvalidAddress hash={userHash} />)

    if (!currentUser || !currentUser.feed || !currentUser.metadata) {
      return <FullPageLoader text="Loading feed..." />
    }

    const isMaster = currentUser.isMaster
    const showMore = currentUser.feed && currentUser.feed.size && currentUser.feed.size < currentUser.feed.first().feedLen
    const { metadata } = currentUser
    const articleList = currentUser.feed.reverse()

    return (
      <div className="Page FeedPage">
        <UserDetails
          onEdit={this.handleProfileEdit}
          name={metadata.get('name')}
          location={metadata.get('location')}
          info={metadata.get('info')}
          showEdit={isMaster}
          isPinned={currentUser.pinned}
          onPin={this.handlePin}
          onUnpin={this.handleUnpin}
        />
        { isMaster ? <ShareProfile url={`https://solipsis-project.github.io/vitriol-web/#/${userHash}`} /> : null}
        { !articleList.size ?
          <EmptyList isMaster={isMaster} /> :
          <CardList
            articleList={articleList}
            linkFormatter={a => `/${userHash}/${a.hash}`}
            authorFormatter={() => currentUser.metadata.get('name')}
            onDelete={isMaster ? a => this.handleDelete(a.hash) : null}
          />
        }
        { this.state.toDelete ?
          <ConfirmationModal
            text="Do you really want to remove this article?"
            buttons={(
              <React.Fragment>
                <button className="Button Secondary" onClick={this.hideConfirmation}>Cancel</button>
                <button className="Button Alert" onClick={this.removeArticle}>Remove</button>
              </React.Fragment>
            )} />
          : null}
        { showMore ? <button className="Button" onClick={this.handleMore}>More...</button> : null}
      </div>
    )
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedFeedPage = connect(mapStateToProps)(FeedPage)
export default ConnectedFeedPage

