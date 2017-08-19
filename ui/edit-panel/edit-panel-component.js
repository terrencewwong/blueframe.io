import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Distribute, Split } from '../../blueframe/layouts'
import { Checkbox, Input, Select, Spacer, Text } from '../../blueframe/atoms'
import SourceCode from '../source-code'

// TODO: cleanup this hack
const VerticalCenter = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`

const Form = ({ children }) => {
  const labeledChildren = children.map(child => {
    const { label } = child.props
    return (
      <Split>
        <Split.Content>
          <VerticalCenter>
            {label}
          </VerticalCenter>
        </Split.Content>
        <Split.Panel position='right' width='50%'>
          {child}
        </Split.Panel>
      </Split>
    )
  })
  return (
    <Distribute space={2} vertical dividers>
      {labeledChildren}
    </Distribute>
  )
}

const PropsPanel = ({ component, onPropChange }) => {
  const { displayName, props, propTypes } = component

  const inputs = Object.keys(props).map(prop => {
    const type = propTypes[prop]
    const value = props[prop]

    if (type === 'boolean') {
      return <Checkbox
        key={prop}
        label={prop}
        checked={value}
        onChange={e => onPropChange(prop, e.target.checked)}
      />
    } else if (type instanceof Array) {
      return <Select
        value={value}
        label={prop}
        width='100%'
        options={type}
        onChange={e => onPropChange(prop, e.target.value)}
      />
    }

    return <Input
      key={prop}
      label={prop}
      type={type}
      value={value}
      onChange={e => onPropChange(prop, e.target.value)}
      width='100%'
    />
  })

  return (
    <div>
      <Spacer bottom={2}>
        <Text size='size1'>{displayName}</Text>
      </Spacer>
      <Form>
        {inputs}
      </Form>
    </div>
  )
}

export default class EditPanelComponent extends Component {
  render () {
    const { components, onPropChange } = this.props

    return (
      <Container size='fill' bg='#f1f1f1'>
        <Split>
          <Split.Content>
            <Container top={2} left={3} right={3} bottom={2}>
              <SourceCode components={components} />
            </Container>
          </Split.Content>
          <Split.Panel
            position='bottom'
            border
          >
            <Container size='fill' top={2} bottom={4} left={4} right={4}>
              <PropsPanel component={components.root} onPropChange={onPropChange} />
            </Container>
          </Split.Panel>
        </Split>
      </Container>
    )
  }
}
