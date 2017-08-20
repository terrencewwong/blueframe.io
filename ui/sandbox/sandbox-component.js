import React, { Component } from 'react'
import uuidv4 from 'uuid/v4'
import { Container, Split } from '../../blueframe/layouts'
import EditPanel from '../edit-panel'
import Preview from '../preview'
import ComponentSelector from '../component-selector'
import componentSchemas from '../../component-schemas.json'

const gridBackground = `url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 42 %2836781%29 - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3EArtboard 2%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Artboard-2' fill='%23FEEDE8'%3E%3Cpath d='M7.5,8 L8,8 L8,-3.55271368e-15 L7,-3.55271368e-15 L7,7 L1.77635684e-15,7 L1.77635684e-15,8 L7.5,8 Z' id='Combined-Shape' transform='translate%284.000000, 4.000000%29 rotate%28-180.000000%29 translate%28-4.000000, -4.000000%29 '%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`

export default class SandboxComponent extends Component {
  state = {
    currentComponent: 'root',
    currentLine: 'openTag',
    showComponentSelector: false,
    candidateParent: null,
    candidateIndex: null,
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

  // When the user clicks the + in the source tree
  // TODO: come up with a better name
  handleAddComponent = (parent, index) => {
    this.setState({
      showComponentSelector: true,
      candidateParent: parent,
      candidateIndex: index
    })
  }

  // When the user selects a component in the component selector
  // TODO: come up with a better name
  handleSelectComponent = component => {
    const schema = componentSchemas[component]

    if (!schema) {
      throw new Error(`Unsupported Component: ${component}`)
    }

    const { components, candidateParent, candidateIndex } = this.state
    const id = uuidv4()
    components[id] = schema
    components[candidateParent].props.children.splice(candidateIndex, 0, id)

    this.setState({
      currentComponent: id,
      showComponentSelector: false,
      candidateParent: null,
      candidateIndex: null,
      components
    })
  }

  hideComponentSelector = () => {
    this.setState({
      showComponentSelector: false,
      candidateParent: null,
      candidateIndex: null 
    })
  }

  render () {
    const {
      currentComponent,
      currentLine,
      components,
      showComponentSelector
    } = this.state

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
            <Container
              size='fill'
              top={7}
              left={8}
              right={3}
              additionalCSS={`
                background-image: ${gridBackground};
              `}
            >
              <Preview components={components} />
            </Container>
          </Split.Content>
        </Split>
        {
          showComponentSelector ? (
            <ComponentSelector
              onEscape={this.hideComponentSelector}
              onSelectComponent={this.handleSelectComponent}
            />
          ) : null
        }
      </Container>
    )
  }
}
