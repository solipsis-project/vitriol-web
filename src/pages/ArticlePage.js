import React from 'react'
import { connect } from 'react-redux'
import dompurify from 'dompurify'
import { load, getArticle } from '../duck/users'
import Editor from '../Editor'
import FullPageLoader from '../components/FullPageLoader'
import InvalidAddress from '../InvalidAddress'

class ArticlePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = { loading: true, articleObject: null, invalidAddress: false }
  }
  
  componentDidMount() {
    this.getArticle()
  }
  
  componentDidUpdate() {
    if (!this.state.articleObject) this.getArticle()
  }
  
  getArticle = () => {
    if (this.state.invalidAddress) return
    
    const { userHash } = this.props.match.params
    if (!global.OrbitDB.isValidAddress(`/orbitdb/${userHash}/user`)) return this.setState({ invalidAddress: true })
    
    if (!this.props.users.get(userHash)) return this.props.dispatch(load(userHash))
    const { articleHash } = this.props.match.params
    const currentUser = this.props.users.get(userHash)
    const isReplicating = currentUser.replication.get('meta') || currentUser.replication.get('feed')
    const feed = currentUser ? currentUser.feed : null
    if (!feed) return // No user or no feed in user, return
    
    const articles = currentUser.articles
    const articleObject = articles.get(articleHash) || feed.find(a => a.hash === articleHash) // Try to find it in the articles

    if (articleObject) return this.setState({ loading: false, articleObject }) // Found, re-render
    // We have everything but still we don't find it. If we're replicating, wait, otherwise, go get it.
    if (!isReplicating) return this.props.dispatch(getArticle(userHash, articleHash)) 
  }
  
  render() {
    const { userHash } = this.props.match.params
    const currentUser = this.props.users.get(userHash)
    
    if (this.state.invalidAddress) return (<InvalidAddress hash={userHash} />)
    if (this.state.loading) return <FullPageLoader text="Loading article..." />
    
    const { articleObject } = this.state
    const text = dompurify.sanitize(articleObject.text)
    
    return (<div className="FullPage">
              <Editor
                readOnly
                title={articleObject.title}
                description={articleObject.description}
                html={text}
                author={{ name: currentUser.metadata.get('name'), url: `/${userHash}` }}
              />
            </div>)
  }
}

function mapStateToProps({ users }) {
  return { users }
}

const ConnectedArticlePage = connect(mapStateToProps)(ArticlePage)
export default ConnectedArticlePage