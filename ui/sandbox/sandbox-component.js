import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'
import { Container, Split } from '../../blueframe/layouts'
import EditPanel from '../edit-panel'
import Preview from '../preview'

export default class SandboxComponent extends Component {
  state = {
    currentComponent: 'root',
    currentLine: 'openTag',
    components: {
      root: {
        displayName: 'Distribute',
        props: {
          children: ['component1', 'component2'],
          align: 'start',
          space: 0,
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
          children: 'Blueframe',
          size: 'size1'
        },
        propTypes: {
          children: 'string',
          size: ['sizen1', 'size0', 'size1']
        }
      },
      component2: {
        displayName: 'Text',
        props: {
          children: 'for designers and devs',
          size: 'size0'
        },
        propTypes: {
          children: 'string',
          size: ['sizen1', 'size0', 'size1']
        }
      }

    }
  }

  handlePropChange = id => (property, value) => {
    const { components } = this.state
    components[id].props[property] = value
    this.setState({ components })
  }

  handleLineClick = (id, line)  => {
    this.setState({
      currentComponent: id,
      currentLine: line,
    })
  }

  handleAddComponent = (parent, index) => {
    const { components } = this.state
    const id = uuidv4()

    components[id] = {
      displayName: 'Text',
      props: {
        children: 'Hello!',
        size: 'size0'
      },
      propTypes: {
        children: 'string',
        size: ['sizen1', 'size0', 'size1']
      }
    }

    components[parent].props.children.splice(index, 0, id)

    this.setState({
      currentComponent: id,
      components
    })
  }

  render () {
    const { currentComponent, currentLine, components } = this.state

    return (
      <Container size='viewport'>
        <Split>
          <Split.Panel
            position='left'
            size='xlg'
          >
            <EditPanel
              currentComponent={currentComponent}
              currentLine={currentLine}
              components={components}
              onPropChange={this.handlePropChange(currentComponent)}
              onLineClick={this.handleLineClick}
              onAddComponent={this.handleAddComponent}
            />
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
