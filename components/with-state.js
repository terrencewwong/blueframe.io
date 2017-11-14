// @flow
import React, { Component } from 'react'

type StateHandlerMap = {
  [handlerName: string]: string
}

export default (C: *, stateHandlerMap: StateHandlerMap) => {
  return class WithState extends Component<*, *> {
    handlers: {
      [handlerName: string]: Function
    }

    constructor (props: *) {
      super(props)
      this.handlers = Object.keys(stateHandlerMap)
        .reduce(
          (handlers, handlerName) => {
            const prop = stateHandlerMap[handlerName]
            handlers[handlerName] = value => this.setState({ [prop]: value })
            return handlers
          }, {}
        )
    }

    render () {
      return (
        <C {...this.props} {...this.state} {...this.handlers} />
      )
    }
  }
}
