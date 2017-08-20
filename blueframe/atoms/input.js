import React from 'react'
import styled, { css } from 'styled-components'
import { unit, sizes } from '../defaults'
import { padding } from '../style-utils'

const scale = ({ big }) => {
  const height = big ? `${8 * unit}px` : `${4 * unit}px`
  // TODO: refactor this so its less hard cody
  const fontSize = big ? '20px' : 'inherit'
  const lineHeight = big ? '28px' : 'inherit'

  return `
    height: ${height};
    font-size: ${fontSize};
    line-height: ${lineHeight};
  `
}

const size = ({ size, width }) => {
  if (!size && !width) return ''

  return size
    ? `width: ${sizes[size]}px;`
    : `width: ${width};`
}

const Input = styled.input`
  ${size}
  ${scale}

  box-sizing: border-box;
  border-radius: 2px;
  border: none;
  margin: 0;
  ${padding}
  font-family: inherit;
  color: inherit;

  ::placeholder {
    color: inherit;
    opacity: 0.54;
  }

  ${props => props['no-outline'] ? `
    :focus {
      outline: none;
    }
  ` : ''}
`
Input.defaultProps = {
  top: 1,
  bottom: 1,
  left: 1,
  right: 1
}
export default Input
