import React from 'react'
import styled from 'styled-components'
import { unit } from '../defaults'

const padding = ({ primary }) => {
  let vertical = unit
  let horizontal = 2 * unit

  if (!primary) {
    vertical -= 1
    horizontal -= 1
  }

  return `padding: ${vertical}px ${horizontal}px;`
}

const small = ({ small }) => {
  if (!small) return ''

  return `
    padding: 0;
    width: 32px;
    height: 16px;
    line-height: 16px;
  `
}

const colors = ({ primary, warning }) => {
  let border = ''
  let background = ''
  let color = ''
  if (primary) {
    border = '0'
    background = 'royalblue'
    color = 'white'
  } else if (warning) {
    border = '1px solid crimson'
    background = 'white'
    color = 'crimson'
  } else {
    border = '1px solid royalblue'
    background = 'white'
    color = 'royalblue'
  }

  return `
    border: ${border};
    background-color: ${background};
    color: ${color};
  `
}

const Button = styled.button`
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;

  height: ${5 * unit}px;
  ${padding}
  ${colors}
  display: block;
  cursor: pointer;

  ${small}

  &:focus {
  	outline: 0;
  }
`

export default Button
