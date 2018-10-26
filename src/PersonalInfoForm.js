import React from 'react'
import './PersonalInfoForm.css'

export default class PersonalInfoForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { name: '', info: '', location: '', hasInitialised: false }
  }
  
  handleNameChange = (e) => this.setState({ name: e.target.value })

  handleInfoChange = (e) => this.setState({ info: e.target.value })

  handleLocationChange = (e) => this.setState({ location: e.target.value })

  handleSubmit = (e) => {
    const { name, info, location } = this.state
    if (!(name && info && location)) return
    else this.props.onSubmit({ name, info, location })
  }
  
  static getDerivedStateFromProps(props, state) {
    /* If we get props for the first time, initialise the state with them
       and prevent any further initialisation. This has to be done here
       because personal info from the store comes asynchronously, 
       later than first render */
    
    const { name, info, location } = props
    const hasProps = name || info || location
    if (!state.hasInitialised && hasProps) return { name, info, location, hasInitialised: true }
    return null
  }
  
  render() {
    const commitButton = this.props.name ? 'SAVE' : 'CREATE'
    const { name, info, location } = this.state
    const isEnabled = name && info && location
    return (
      <div className="PersonalInfo">
        <input name="name" className="PersonalInfoInput PersonalInfoName" value={name} onChange={this.handleNameChange} placeholder="Enter your name..."/>
        <input name="location" className="PersonalInfoInput PersonalInfoLocation" value={location} onChange={this.handleLocationChange} placeholder="Enter your location..."/>
        <textarea maxLength={250} rows={3} name="info" className="PersonalInfoInput PersonalInfoDetails" value={info} onChange={this.handleInfoChange} placeholder="Enter some info about you..."/>
        <button className="Button Secondary PersonalInfoButton" onClick={this.props.onCancel}>CANCEL</button>  
        <button disabled={!isEnabled} className="Button PersonalInfoButton" onClick={this.handleSubmit}>{commitButton}</button>
    </div>)
  }
}