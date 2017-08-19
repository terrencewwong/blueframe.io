import React, { Component } from 'react'
import styled from 'styled-components'

const MAX_LINE_LENGTH = 44

const Code = styled.code`
  font-size: 13px;
  white-space: pre;
`

const hasChildren = children => children instanceof Array && children.length
const calculateIndentation = depth =>
  Array.from(Array(depth)).map(() => '  ').join('')

const SourceTree = ({ id, components, depth }) => {
  const { displayName, props, propTypes } = components[id]
  const { children, ...rest } = props
  const propsCode = Object.keys(rest)
    .map(prop => {
      switch (propTypes[prop]) {
        case 'boolean':
          return props[prop] ? prop : ''

        case 'number':
          return `${prop}={${props[prop]}}`

        default:
          return `${prop}='${props[prop]}'`
      }
    })

  const indentation = calculateIndentation(depth)

  let openTag = indentation + (
    propsCode.length
      ? `<${displayName} ${propsCode.join(' ')}>`
      : `<${displayName}>`
  )

  console.log(openTag.length)
  if (openTag.length > MAX_LINE_LENGTH) {
    const indentedProps = propsCode.map(prop => '  ' + prop)

    openTag = [`<${displayName}`, ...indentedProps, '/>']
      .map(line => indentation + line)
      .join('\n')
  }

  const closeTag = indentation + `</${displayName}>`

  if (hasChildren(children)) {
    const sourceChildren = children.map(child => SourceTree({ id: child, components, depth: depth + 1 }))
    return [openTag, sourceChildren, closeTag].join('\n')
  }

  return [openTag, '  ' + indentation + props.children, closeTag].join('\n')
}

export default ({ components }) => {
  const sourceTree = SourceTree({
    id: 'root',
    components,
    depth: 0
  })

  return <Code>{sourceTree}</Code>
}
