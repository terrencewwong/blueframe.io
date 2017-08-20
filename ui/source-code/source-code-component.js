import React, { Component } from 'react'
import styled from 'styled-components'
import { unit } from '../../blueframe/defaults'
import Line from './line'

const MAX_LINE_LENGTH = 44

const Pre = styled.pre`
  margin: 0;
  font-size: 13px;
`

const canHaveChildren = children => children instanceof Array
const hasChildren = children => canHaveChildren(children) && children.length
const calculateIndentation = depth =>
  Array.from(Array(depth)).map(() => '  ').join('')

const SourceTree = ({
  id,
  parent,
  index,
  currentComponent,
  currentLine,
  components,
  depth,
  onLineClick,
  onAddComponent
}) => {
  const { displayName, props, propTypes } = components[id]
  const { children, ...rest } = props

  const onClick = lineType => () => onLineClick(id, lineType)
  const onOpenTagClick = onClick('openTag')
  const onCloseTagClick = onClick('closeTag')
  const onChildClick = onClick('child')

  const onOpenTagAddComponent = canHaveChildren(children)
    ? () => onAddComponent(id, 0)
    : !propTypes.children
      ? () => onAddComponent(parent, index + 1)
      : null

  const propsCode = Object.keys(rest)
    .filter(prop => propTypes[prop] !== 'boolean' || props[prop])
    .map(prop => {
      switch (propTypes[prop]) {
        case 'boolean':
          return prop

        case 'number':
          return `${prop}={${props[prop]}}`

        default:
          return `${prop}='${props[prop]}'`
      }
    })

  const indentation = calculateIndentation(depth)

  const closeBracket = propTypes.children ? '>' : '/>'
  let openTag = indentation + (
    propsCode.length
      ? `<${displayName} ${propsCode.join(' ')}${closeBracket}`
      : `<${displayName}${closeBracket}`
  )


  if (openTag.length > MAX_LINE_LENGTH) {
    const indentedProps = propsCode.map(prop => '  ' + prop)

    openTag = [`<${displayName}`, ...indentedProps, closeBracket]
      .map(line => indentation + line)
      .join('\n')
  }

  openTag = (
    <Line
      onClick={onOpenTagClick}
      onAddComponent={onOpenTagAddComponent}
      current={id === currentComponent && currentLine === 'openTag'}
    >
      {openTag}
    </Line>
  )

  // TODO: omg clean up this spaghetti
  if (!propTypes.children) return <Pre>{openTag}</Pre>

  const closeTag = (
    <Line
      onClick={onCloseTagClick}
      onAddComponent={parent ? () => onAddComponent(parent, index + 1) : null}
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
  ) : children.map((child, index) => (
    <SourceTree
      id={child}
      parent={id}
      index={index}
      currentComponent={currentComponent}
      currentLine={currentLine}
      components={components}
      depth={depth + 1}
      onLineClick={onLineClick}
      onAddComponent={onAddComponent}
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
  onLineClick,
  onAddComponent
}) => (
  <SourceTree
    id='root'
    currentComponent={currentComponent}
    currentLine={currentLine}
    components={components}
    depth={0}
    onLineClick={onLineClick}
    onAddComponent={onAddComponent}
  />
)
