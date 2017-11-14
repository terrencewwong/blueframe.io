// @flow
import React, { Component } from 'react'

type Props = {
  name: string
}
class Tag extends Component<Props> {
  render () {
    const { name } = this.props
    return (
      <div>{name}</div>
    )
  }
}

export default Tag
