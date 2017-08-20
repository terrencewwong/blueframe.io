import React, { Component } from 'react'
import styled from 'styled-components'
import { unit } from '../../blueframe/defaults'

const MAX_LINE_LENGTH = 44

const Pre = styled.pre`
  margin: 0;
  font-size: 13px;
`

const Line = styled.span`
  display: ${props => props.block ? 'block' : 'inline-block'};
  width: 100%;
  padding-left: ${unit}px;
  ${props => props.current && 'background-color: white;'}
  cursor: pointer;

  :hover {
    background-color: #ebf1fb;
  }
`

const hasChildren = children => children instanceof Array && children.length
const calculateIndentation = depth =>
  Array.from(Array(depth)).map(() => '  ').join('')

const SourceTree = ({
  id,
  currentComponent,
  currentLine,
  components,
  depth,
  onLineClick
}) => {
  const { displayName, props, propTypes } = components[id]
  const { children, ...rest } = props

  const onClick = lineType => () => onLineClick(id, lineType)
  const onOpenTagClick = onClick('openTag')
  const onCloseTagClick = onClick('closeTag')
  const onChildClick = onClick('child')

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

  if (openTag.length > MAX_LINE_LENGTH) {
    const indentedProps = propsCode.map(prop => '  ' + prop)

    openTag = [`<${displayName}`, ...indentedProps, '/>']
      .map(line => indentation + line)
      .join('\n')
  }

  openTag = (
    <Line
      onClick={onOpenTagClick}
      current={id === currentComponent && currentLine === 'openTag'}
    >
      {openTag}
    </Line>
  )

  const closeTag = (
    <Line
      onClick={onCloseTagClick}
      current={id === currentComponent && currentLine === 'closeTag'}
    >
      {indentation + `</${displayName}>`}
    </Line>
  )

  const sourceChildren = !hasChildren(children) ? (
    <Line
      block
      current={id === currentComponent && currentLine === 'child'}
      onClick={onChildClick}
    >
      {indentation + '  ' + props.children}
    </Line>
  ) : children.map(child => (
    <SourceTree
      id={child}
      currentComponent={currentComponent}
      currentLine={currentLine}
      components={components}
      depth={depth + 1}
      onLineClick={onLineClick}
    />
  ))

  return (
    <Pre>
      {openTag}
      {sourceChildren}
      {closeTag}
    </Pre>
  )
}

export default ({
  currentComponent,
  currentLine,
  components,
  onLineClick
}) => (
  <SourceTree
    id='root'
    currentComponent={currentComponent}
    currentLine={currentLine}
    components={components}
    depth={0}
    onLineClick={onLineClick}
  />
)
