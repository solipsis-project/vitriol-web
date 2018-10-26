import { List } from 'immutable'

const ADD_NOTIFICATION = 'ADD_NOTIFICATION'

export function addNotification(notification) {
  return { type: 'ADD_NOTIFICATION', notification }
}

export default function reducer(state = List([]), action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return state.unshift({...action.notification, read: false})
    default:
    return state
  }
}