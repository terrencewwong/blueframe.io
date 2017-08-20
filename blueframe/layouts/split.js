import React from 'react'
import styled, { css } from 'styled-components'
import include from 'styled-conditional-include'
import { unit, sizes } from '../defaults'

const FLIPPED_POSITIONS = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
}

const space = ({ space, position }) => {
  if (!space) return ''

  const marginPosition = isPositionVertical(position)
    ? 'bottom'
    : 'right'

  return `
    > :first-child {
      margin-${marginPosition}: ${space * unit}px;
    }
  `
}

const SplitWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  ${props => props.vertical && 'flex-direction: column;'}
  ${space}
`

const size = ({ size, position, width }) => {
  if (width) return `width: ${width};`

  if (!size) return ''

  const dimension = position === 'top' || position === 'bottom'
    ? 'height'
    : 'width'

  size = sizes[size] || size

  return `${dimension}: ${size}px;`
}

const border = ({ border, position }) => {
  if (!border) return ''

  position = FLIPPED_POSITIONS[position]

  return `border-${position}: 1px solid #D8D8D8;`
}

const Panel = styled.div`
  box-sizing: border-box;
  ${size}
  ${border}
`
Panel.defaultProps = {
  position: 'left'
}
Panel.displayName = 'Split.Panel'

const Content = styled.div`flex: 1;`
Content.displayName = 'Split.Content'

const isPositionVertical = position => {
  if (!position) return false

  return position === 'top' || position === 'bottom'
}

const renderPanelFirst = position => position === 'left' || position === 'top'

const Split = ({ space, children, ...rest }) => {
  if (children.length !== 2) {
    throw new Error('children must be <Split.Panel> and <Split.Content>')
  }

  const panel = children.find(child => child.type.displayName === Split.Panel.displayName)
  const content = children.find(child => child.type.displayName === Split.Content.displayName)

  if (!panel || !content) {
    throw new Error('children must be <Split.Panel> and <Split.Content>')
  }

  const vertical = isPositionVertical(panel.props.position)

  const orderedChildren = renderPanelFirst(panel.props.position)
    ? [ panel, content ]
    : [ content, panel ]

  return (
    <SplitWrapper
      vertical={vertical}
      space={space}
      position={panel.props.position}
      {...rest}
    >
      {orderedChildren}
    </SplitWrapper>
  )
}

Split.Panel = Panel
Split.Content = Content

export default Split
