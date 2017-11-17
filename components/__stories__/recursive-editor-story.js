// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import SourceEditor from '../recursive-editor'
import type { ComponentMap } from '../types/components'

const componentMap = {
  root: {
    name: 'Distribute',
    children: ['text', 'button']
  },
  text: {
    name: 'Text',
    props: [
      {
        name: 'size',
        value: 'm'
      }
    ],
    children: ['textContent']
  },
  textContent: 'label for a button',
  button: {
    name: 'Button',
    props: [
      {
        name: 'size',
        value: 'm'
      }
    ],
    children: ['buttonContent']
  },
  buttonContent: 'Click me!'
}

class StatefulSourceEditor extends React.Component<*, {
  componentMap: ComponentMap
}> {
  constructor (props) {
    super(props)
    this.state = {
      componentMap: props.componentMap
    }
  }

  handleComponentChange = (componentId: string, component: *) => {
    const { onComponentChange } = this.props
    const { componentMap } = this.state

    // Hmmm maybe I should't make the payload
    // a patch and instead an update?
    typeof component === 'string'
      ? componentMap[componentId] = component
      // $FlowFixMe
      : componentMap[componentId] = {
        ...componentMap[componentId],
        ...component
      }

    // TODO: should we duplicate componentMap so the
    // data structure is "immutable" between states?

    this.setState({ componentMap })
    onComponentChange && onComponentChange(componentId, component)
  }

  render () {
    return (
      <SourceEditor
        {...this.props}
        {...this.state}
        onComponentChange={this.handleComponentChange}
      />
    )
  }
}

storiesOf('RecursiveEditor', module)
  .add('default', () =>
    <StatefulSourceEditor
      componentMap={componentMap}
      onComponentChange={(componentId, component) => console.log(`onComponentChange - id: ${componentId} component: ${JSON.stringify(component)}`)}
    />
  )
