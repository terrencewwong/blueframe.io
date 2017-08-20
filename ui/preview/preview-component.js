import React from 'react'
import styled from 'styled-components'
import Layouts, { Container } from '../../blueframe/layouts'
import Atoms from '../../blueframe/atoms'

const hasChildren = children => children instanceof Array && children.length

const ComponentTree = ({ id, components }) => {
  const { displayName, props } = components[id]
  const { children, ...rest } = props
  const Component = Atoms[displayName] || Layouts[displayName]

  if (hasChildren(children)) {
    return (
      <Component {...rest}>
        {children.map(child => <ComponentTree id={child} components={components} />)}
      </Component>
    )
  }

  return <Component children={children} {...rest} />
}

export default ({ components }) => {
  return (
    <Container size='fill'>
      <ComponentTree id='root' components={components} />
    </Container>
  )
}
