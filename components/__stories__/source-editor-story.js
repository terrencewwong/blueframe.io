// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import SourceEditor from '../source-editor'
import type { ComponentMap } from '../types/components'

const componentMap = {
  root: {
    name: 'Text',
    props: [
      {
        name: 'size',
        value: 'm'
      }
    ],
    children: ['child']
  },
  child: 'Hello, world!'
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

storiesOf('SourceEditor', module)
  .add('default', () =>
    <StatefulSourceEditor
      componentMap={componentMap}
      onComponentChange={(componentId, component) => console.log(`onComponentChange - id: ${componentId} component: ${JSON.stringify(component)}`)}
    />
  )
