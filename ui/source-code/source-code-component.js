import React, { Component } from 'react'
import styled from 'styled-components'
import {
  Button,
  Spacer,
  StyleCascader,
  Text
} from '../../blueframe/atoms'

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const Highlightable = styled.div`
  :hover {
    background-color: #f1f4fd;
  }
`

const openTag = component => {
  return `<${component}>`
}

const closeTag = component => {
  return `</${component}>`
}

class _SourceCode extends Component {
  state = {
    shouldShowActions: false
  }

  toggleShouldShowActions = () => {
    this.setState({ shouldShowActions: !this.state.shouldShowActions })
  }

  renderFirstLine () {
    const { id, component, setCurrentComponent } = this.props
    const { shouldShowActions } = this.state
//    const shouldShowActions = true

    const text = (
      <Text
        size='sizen1'
        tag='pre'
        monospace
        inline={shouldShowActions}
      >
        {openTag(component)}
      </Text>
    )

    return shouldShowActions ? (
      <Flex>
        {text}
        <Spacer left={1}>
          <Button small onClick={() => setCurrentComponent(id)}>✎</Button>
        </Spacer>
        <Spacer left={1}>
          <Button small warning>X</Button>
        </Spacer>
      </Flex>
    ) : text
  }

  render () {
    const { component, children } = this.props

    return (
      <StyleCascader font-size='13px' line-height='20px'>
        <Highlightable
          onMouseEnter={this.toggleShouldShowActions}
          onMouseLeave={this.toggleShouldShowActions}
        >
          {this.renderFirstLine()}
          <Text tag='pre' monospace>{'  ' + children}</Text>
          <Text tag='pre' monospace>{closeTag(component)}</Text>
        </Highlightable>
      </StyleCascader>
    )
  }
}

export default ({ componentMap, setCurrentComponent }) => {
  const { component, children } = componentMap.root

  return <_SourceCode
    id='root'
    component={component}
    children={children}
    setCurrentComponent={setCurrentComponent}
  />
}
