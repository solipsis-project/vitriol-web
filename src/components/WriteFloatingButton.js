import React from 'react'
import { Link } from 'react-router-dom'
import { FiEdit2 } from 'react-icons/fi'
import './WriteFloatingButton.css'

export default function WriteFloatingButton() {
  return (
    <Link to={{
            pathname: "/write",
            state: { internal: true }
          }}>
      <button className="WriteFloatingButton"><FiEdit2 /></button>
    </Link>
    )
}