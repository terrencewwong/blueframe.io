import React from 'react'
import styled from 'styled-components'
import defaults from '../defaults'

const font = ({ size }) => {
  return defaults.fonts.sizes[size]
}

const BaseText = styled.p`
  ${font}
  ${props => props.monospace && defaults.fonts.monospace}
  ${props => props.inline ? 'display: inline;' : ''}
  ${props => props.onClick ? 'cursor: pointer;' : ''}
`

const Text = ({ tag = 'p', children, ...rest }) => {
  const Tag = BaseText.withComponent(tag)

  return (
    <Tag {...rest}>
      {children}
    </Tag>
  )
}

export default Text
