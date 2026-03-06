import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRegistry } from 'react-native'
import App from './App.jsx'
import './index.css'

AppRegistry.registerComponent('App', () => App)
AppRegistry.runApplication('App', {
  rootTag: document.getElementById('root')
})
