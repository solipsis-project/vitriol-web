import './Dropdown.css'
import React from 'react'

function withDropdown(DropDownHead, DropDownBody) {

 return class extends React.Component {
  
   constructor(props) {
     super(props)
     this.state = { isOpen : false }
   }

  componentDidMount() {
    document.addEventListener('click', this.hideDropDown)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hideDropDown)
  }
    
  hideDropDown = event => {
    if (!event.target.closest('.DropdownToggle, .DropdownContent')) {
      this.setState({ isOpen: false })
    }
  }

  handleToggleDropdown = () => {
    this.setState({
     isOpen: !this.state.isOpen
   })
  }
  
  render() {
     
    return (
      <div className="Dropdown">
        <button className="DropdownToggle" onClick={ this.handleToggleDropdown }>{DropDownHead}</button>
         {this.state.isOpen && <div className="DropdownContent">
            <DropDownBody/>
          </div>
         }
      </div>
    )
  }
 } 
}

export default withDropdown