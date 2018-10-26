import React from 'react'
import { Link } from 'react-router-dom'
import './EmptyList.css'

export default function EmptyList({ isMaster }) {
  return (
    <div className="EmptyList">
      <p className="EmptyListMessage">It seems there is nothing here.</p>
      { 
        isMaster ? 
        (<Link to={{ pathname: "/write", state: { internal: true }}}>
          <button className="Button">Write post</button>
        </Link>)
        : 
        null
      } 
    </div>
  )
}