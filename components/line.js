// @flow
import React from 'react'
import styled from 'styled-components'
import Monospace from './monospace'
import type { Node } from 'react'

const isCurrentLineStyles = ({ isCurrentLine, plainText }) => {
  if (isCurrentLine) {
    return `
      background-color: #3879d9;

      .plain-text, .tag-name-text, .prop-value-text {
        color: white;
      }

      .monospace, .prop-name-text {
        color: #c0c0c0;
      }
    `
  }

  return `
    &:hover {
      background-color: rgba(56, 121, 217, 0.1);
    }
  `
}

// HACK - `calcIsCurrentLine` is a function because the subtrees are rendered asynchronously
const Highlightable = styled.div`
  ${isCurrentLineStyles}

  outline: none;
`

class Line extends React.Component<{
  calcIsCurrentLine: () => boolean,
  depth: number,
  innerRef: (elem: ?HTMLDivElement) => *,
  children: Node
}> {
  render () {
    const {
      calcIsCurrentLine,
      depth,
      children,
      innerRef,
      ...rest
    } = this.props

    const isCurrentLine = calcIsCurrentLine()
    const ref = isCurrentLine ? innerRef : () => {}

    const spaces = depth ? (
      <Monospace
        dangerouslySetInnerHTML={{
          __html: '&nbsp;'.repeat(depth * 2)
        }}
      />
    ) : null

    // HACK: add tabIndex to keyDown events work
    // see: https://stackoverflow.com/a/44434971
    return (
      <Highlightable
        innerRef={ref}
        isCurrentLine={isCurrentLine}
        tabIndex={0}
        {...rest}
      >
        {spaces}
        {children}
      </Highlightable>
    )
  }
}
export default Line
