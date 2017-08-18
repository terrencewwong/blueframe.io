import React, { Component } from 'react'

export default class ComponentEditor extends Component {
  render () {
    const { component, children } = this.props

    return <div>
      {component}
      <input type="text" value={children} />
    </div>
  }
}
