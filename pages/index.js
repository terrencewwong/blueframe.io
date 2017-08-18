import React from 'react'
import withRedux from 'next-redux-wrapper'
import { initStore } from '../store'
import { StyleCascader } from '../blueframe/atoms'
import Sandbox from '../ui/sandbox'

const Index = () => (
  <StyleCascader>
    <Sandbox />
  </StyleCascader>
)

export default withRedux(initStore)(Index)
