// @flow
import React from 'react'
import styled from 'styled-components'
import Monospace from './monospace'
import type { Node } from 'react'

const activeStyles = ({ active, plainText }) => {
  if (active) {
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

const Highlightable = styled.div`
  ${activeStyles}

  outline: none;
`

class Line extends React.Component<{
  active: boolean,
  depth: number,
  children: Node
}> {
  // TODO: get rid of this shit
  static defaultProps = {
    active: false,
    depth: 0
  }

  render () {
    const {
      depth,
      children,
      ...rest
    } = this.props

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
