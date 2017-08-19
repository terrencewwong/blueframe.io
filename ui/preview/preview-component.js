import React from 'react'
import styled from 'styled-components'
import * as Layouts from '../../blueframe/layouts'
import * as Atoms from '../../blueframe/atoms'

const Background = styled(Layouts.Container)`
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg width='8px' height='8px' viewBox='0 0 8 8' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3C!-- Generator: Sketch 42 %2836781%29 - http://www.bohemiancoding.com/sketch --%3E%3Ctitle%3EArtboard 2%3C/title%3E%3Cdesc%3ECreated with Sketch.%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cg id='Artboard-2' fill='%23FEEDE8'%3E%3Cpath d='M7.5,8 L8,8 L8,-3.55271368e-15 L7,-3.55271368e-15 L7,7 L1.77635684e-15,7 L1.77635684e-15,8 L7.5,8 Z' id='Combined-Shape' transform='translate%284.000000, 4.000000%29 rotate%28-180.000000%29 translate%28-4.000000, -4.000000%29 '%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`

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
    <Background size='fill'>
      <ComponentTree id='root' components={components} />
    </Background>
  )
}
