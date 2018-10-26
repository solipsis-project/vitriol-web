import React from 'react'
import { FiInfo } from 'react-icons/fi'
import './ShareProfile.css'

export default class ShareProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = { copied: false }
  }
  
  handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(this.props.url).then(this.showCopied)
    else {
      this.inputRef.select()
      document.execCommand("copy")
      this.showCopied()
    }
  }
  
  showCopied = () => {
    this.setState({ copied: true })
    setTimeout(() => this.setState({ copied: false }), 2000)
  }

  handleClick = () => this.inputRef.setSelectionRange(0, this.inputRef.value.length)
  
  render() {
    return (
      <div className="ShareProfile">
        <div className="ShareProfileCard Card">
          <span className="ShareProfileMessage">
            <FiInfo />
            <span className="ShareProfileTextMessage">You can share your feed using this address:</span>
          </span>
          <div className="ShareProfileContainer">
            <input className="ShareInput" ref={n => this.inputRef = n} onClick={this.handleClick} readOnly value={this.props.url} />
            <button className="ShareButton Button" onClick={this.handleCopy}>Copy</button>
          </div>
          <span className={`ShareMessage ${this.state.copied ? 'show' : ''}`}>Copied!</span>
        </div>
      </div>
      )
  }

}