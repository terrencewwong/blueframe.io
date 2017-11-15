// @flow
import React from 'react'
import styled from 'styled-components'
import Monospace from './monospace'
import type { Node } from 'react'

const Highlightable = styled.div`
  &:hover {
    background-color: rgba(56, 121, 217, 0.1);
  }
`

const Line = ({
  depth,
  children
}: {
  depth: number,
  children: Node
}) => {
  const spaces = depth ? (
    <Monospace dangerouslySetInnerHTML={{
      __html: '&nbsp;'.repeat(depth * 2)
    }}/>
  ) : null

  return (
    <Highlightable>
      {spaces}
      {children}
    </Highlightable>
  )
}
export default Line
