import React, { Component } from 'react'
import { Container, Split } from '../../blueframe/layouts'
import EditPanel from '../edit-panel'
import Preview from '../preview'

export default class SandboxComponent extends Component {
  state = {
    components: {
      root: {
        displayName: 'Distribute',
        props: {
          children: ['component1'],
          align: 'center',
          space: 2,
          vertical: true
        },
        propTypes: {
          children: 'array',
          align: ['start', 'center', 'end'],
          space: 'number',
          vertical: 'boolean'
        }
      },
      component1: {
        displayName: 'Text',
        props: {
          children: 'Hello, world!',
          size: 'size0'
        },
        propTypes: {
          children: 'string',
          size: ['sizen1', 'size0', 'size1']
        }
      }
    }
  }

  handlePropChange = (property, value) => {
    const { components } = this.state
    components.root.props[property] = value
    this.setState({ components })
  }

  render () {
    const { components } = this.state

    return (
      <Container size='viewport'>
        <Split>
          <Split.Panel
            position='left'
            size='lg'
          >
            <EditPanel components={components} onPropChange={this.handlePropChange} />
          </Split.Panel>
          <Split.Content>
            <Container size='fill' top={7} left={8} right={3}>
              <Preview components={components} />
            </Container>
          </Split.Content>
        </Split>
      </Container>
    )
  }
}
