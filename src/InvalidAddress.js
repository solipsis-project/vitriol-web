import React from 'react'
import { Link } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'
import './InvalidAddress.css'

export default function InvalidAddress({ hash }) {
  return (
    <div className="InvalidAddress">
      <FiAlertTriangle className="alert"/>
      <div className="message">
        <span className="name">{hash}</span>{' '} doesn't seem to be a valid id for a feed. <br/>Please check your URL or{' '}<Link to='/home'>return to the home page</Link>.
      </div>
    </div>
  )
}