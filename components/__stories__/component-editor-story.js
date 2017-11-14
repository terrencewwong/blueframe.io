// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import ComponentEditor from '../component-editor'

class StatefulComponentEditor extends React.Component<*, {
  name: string
}> {
  constructor (props) {
    super(props)
    this.state = {
      name: props.name
    }
  }

  handleComponentChange = component => {
    const { onComponentChange } = this.props
    this.setState(component)
    onComponentChange && onComponentChange(component)
  }

  render () {
    return (
      <ComponentEditor
        {...this.props}
        {...this.state}
        onComponentChange={this.handleComponentChange}
      />
    )
  }
}

storiesOf('ComponentEditor', module)
  .add('default', () =>
    <StatefulComponentEditor
      name='Text'
      props={[
        {
          name: 'size',
          value: 'm'
        }
      ]}
      onComponentChange={component => console.log(`onComponentChange - ${JSON.stringify(component)}`)}
      onComponentDelete={() => console.log('onComponentDelete')}
    />
  )
