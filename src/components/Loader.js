import React from 'react'
import './Loader.css'

function Loader({ text }) {
  return (
    <div className="loaderContainer">
      { text ? <p>{ text }</p> : null }
      <div className="spinner" /> 
    </div>
  )
}

export default Loader 