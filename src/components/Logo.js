import React from 'react'

export default function Logo({ className = '', strokeWidth = 10 }) {
  return (
    <svg className={`Logo ${className}`} width="202" height="201" viewBox="0 0 202 201" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth={strokeWidth}>
        <path d="M192.799 32L101 191L9.20131 32L192.799 32Z" fill="white" stroke="black"/>
        <line x1="3.49691e-07" y1="4" x2="200" y2="4" stroke="black"/>
        <line x1="4.37114e-07" y1="100" x2="200" y2="100" stroke="black"/>
      </g>
    </svg>
  )
}