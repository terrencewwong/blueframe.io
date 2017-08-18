import React from 'react'
import styled, { css } from 'styled-components'
import { unit, sizes } from '../defaults'

const size = ({ size, width }) => {
  if (!size && !width) return ''

  return size
    ? `width: ${sizes[size]}px;`
    : `width: ${width};`
}

const Input = styled.input`
  ${size}
  box-sizing: border-box;
  height: ${4 * unit}px;
  border-radius: 2px;
  border: none;
  margin: 0;
  padding: ${unit}px;
  font-size: inherit;
  font-family: inherit;
  color: inherit;

  ::placeholder {
    color: inherit;
    opacity: 0.54;
  }
`

export default Input
