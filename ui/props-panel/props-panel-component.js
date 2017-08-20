import React, { Component } from 'react'
import styled from 'styled-components'
import { Container, Distribute, Split } from '../../blueframe/layouts'
import { Checkbox, Input, Select, Spacer, Text } from '../../blueframe/atoms'

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
    <Distribute space={2} vertical>
      {labeledChildren}
    </Distribute>
  )
}

export default ({ component, onPropChange }) => {
  const { displayName, props, propTypes } = component

  const inputs = Object.keys(props)
    // TODO: make this less hacky, skip children prop when appropriate
    .filter(prop => prop !== 'children' || propTypes[prop] === 'string')
    .map(prop => {
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
