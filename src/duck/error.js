import { Record } from 'immutable'

const SET_UNRECOVERABLE = 'SET_UNRECOVERABLE'

export function setUnrecoverableError(err) {
  return { type: 'SET_UNRECOVERABLE', err }
}

const ErrorRecord = Record({
  unrecoverable: null
})

export default function reducer(state = new ErrorRecord(), action) {
  switch (action.type) {
    case SET_UNRECOVERABLE:
      return state.set('unrecoverable', action.err)
    default:
    return state
  }
}