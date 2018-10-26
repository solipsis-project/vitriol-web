import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './duck'

const store = createStore(
  combineReducers(reducers),
  {},
  applyMiddleware(thunkMiddleware)
)

export default store