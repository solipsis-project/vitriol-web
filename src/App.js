import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './reducers'
import Routes from './Routes'
import './App.css'

class App extends Component {  
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}

export default App
