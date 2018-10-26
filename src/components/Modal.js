import './Modal.css'
import React from 'react'
import ReactDOM from 'react-dom'
const appRoot = document.getElementById('root')


class Modal extends React.Component {
  preventScroll(e) { 
    e.preventDefault()
  }

  componentDidMount() {
    this.node.addEventListener('wheel', this.preventScroll, false)
    this.node.addEventListener('touchmove', this.preventScroll, false)
  }

  componentWillUnmount() {
    this.node.removeEventListener('wheel', this.preventScroll, false)
    this.node.removeEventListener('touchmove', this.preventScroll, false)
  }
  
  render() {
    const { children } = this.props
    return ReactDOM.createPortal(
      <div ref={n => this.node = n} className="Modal">
        <div className={"ModalBackdrop"}>
          <div className="ModalContent">
              { children }
          </div>
        </div>
      </div>,
      appRoot
    )
  }
}

export default Modal