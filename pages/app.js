import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import { StyleCascader, Button, Text, Spacer } from '../blueframe/atoms'

const Blueframe = {
  Text
}

injectGlobal`
  body {
    margin: 0;
  }
`

const openTag = component => {
  return `<${component}>`
}

const closeTag = component => {
  return `</${component}>`
}

const HighlightSoureCode = styled.div`
  :hover {
    background-color: #f1f4fd;
  }
`

const Flex = styled.div`
  display: flex;
  line-height: 16px;
`

class SourceCodeWidget extends Component {
  state = {
    hasHover: false
  }

  toggleHover = () => this.setState({ hasHover: !this.state.hasHover })

  render () {
    const {
      firstLine,
      otherLines,
      editComponent,
      deleteComponent
    } = this.props

    const firstLineWidget = this.state.hasHover ? (
      <Flex>
        {firstLine()}
        <Spacer inline left={1}>
          <Button small onClick={editComponent}>✎</Button>
        </Spacer>
        <Spacer inline left={1}>
          <Button small warning onClick={deleteComponent}>X</Button>
        </Spacer>
      </Flex>
    ) : firstLine()

    return (
      <HighlightSoureCode onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
        {firstLineWidget}
        {otherLines()}
      </HighlightSoureCode>
    )
  }
}

const SourceCode = ({ componentMap, onEditComponent }) => {
  const { component, children } = componentMap.root

  if (!component) return null

  if (typeof children === 'string') {
    const firstLine = () => (
      <Text size='sizen1' tag='pre' monospace>{openTag(component)}</Text>
    )

    const otherLines = () => (
      <div>
        <Text size='sizen1' tag='pre' monospace>{'  ' + children}</Text>
        <Text size='sizen1' tag='pre' monospace>{closeTag(component)}</Text>
      </div>
    )

    return (
      <SourceCodeWidget
        editComponent={() => onEditComponent('root')}
        firstLine={firstLine}
        otherLines={otherLines}
      />
    )
  }
}

const Preview = ({ componentMap }) => {
  const { component, children } = componentMap.root
  if (typeof children === 'string') {
    const Component = Blueframe[component]
    return <Component>{children}</Component>
  }

  return null
}

export default class Index extends Component {
  state = {
    currentComponentId: null,
    componentMap: null
  }

  addText = () => {
    const { componentMap } = this.state

    if (!componentMap) {
      this.setState({
        componentMap: {
          root: {
            component: 'Text',
            children: 'added text!',
          }
        },
        currentComponentId: 'root'
      })
    }
  }

  updateCurrentComponentId = id => this.setState({ currentComponentId: id })

  render () {
    const { componentMap, currentComponentId } = this.state

    const componentEditor = componentMap && componentMap[currentComponentId] ? (
      <pre>{JSON.stringify(componentMap[currentComponentId], null, 2)}</pre>
    ) : (
      <Text>not editing component</Text>
    )

    const sourceCode = componentMap ? (
      <SourceCode
        componentMap={componentMap}
        onEditComponent={id => this.updateCurrentComponentId(id)}
      />
    ) : null

    const preview = componentMap ? (
      <Preview componentMap={componentMap} />
    ) : null

    return (
      <StyleCascader>
        {componentEditor}
        <Button primary onClick={this.addText}>Add Text</Button>
        {sourceCode}
        {preview}
      </StyleCascader>
    )
  }
}
