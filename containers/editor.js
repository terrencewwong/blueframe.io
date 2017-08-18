import React from 'react'
import { connect } from 'react-redux'
import Editor from '../components/editor'

export default connect(state => state)(props => {
  console.log(props)
  return <Editor />
})
