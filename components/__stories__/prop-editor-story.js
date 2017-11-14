// @flow
import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import PropEditor from '../prop-editor'

class StatefulPropEditor extends Component<*, *> {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name || '',
      value: props.value
    }
  }

  handlePropChange = (prop) => {
    const { onPropChange } = this.props
    this.setState({ ...prop })
    onPropChange && onPropChange(prop)
  }

  render () {
    return (
      <PropEditor {...this.props} {...this.state} onPropChange={this.handlePropChange} />
    )
  }
}

storiesOf('PropEditor', module)
  .add('default', () =>
    <StatefulPropEditor
      component='Text'
      name='size'
      value='m'
      onPropChange={prop => console.log(`onPropChange - ${JSON.stringify(prop, null, 2)}`)}
    />
  )
