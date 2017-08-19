import React, { Component } from 'react'
import { Container, Split } from '../../blueframe/layouts'
import EditPanel from '../edit-panel'
import Preview from '../preview'

export default class SandboxComponent extends Component {
  state = {
    component: {
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

  handlePropChange = (property, value) => {
    const { component } = this.state
    component.props[property] = value
    this.setState({ component })
  }

  render () {
    const { component } = this.state

    return (
      <Container size='viewport'>
        <Split>
          <Split.Panel
            position='left'
            size='lg'
          >
            <EditPanel component={component} onPropChange={this.handlePropChange} />
          </Split.Panel>
          <Split.Content>
            <Container size='fill' top={7} left={8} right={3}>
              <Preview component={component} />
            </Container>
          </Split.Content>
        </Split>
      </Container>
    )
  }
}
