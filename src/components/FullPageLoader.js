import React from 'react'
import Loader from './Loader'

const style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function FullPageLoader({ text }) {
  return (
    <div style={style}>
      <Loader text={text} />
    </div>
  )
}

export default FullPageLoader 