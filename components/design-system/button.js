// @flow
import React from 'react'
import styled from 'styled-components'
const sizeStyles = {
  s: `
    font-size: 14px;
  `,
  m: `
    font-size: 18px;
  `,
  l: `
    font-size: 22px;
  `
}
const Button = styled.button`
  ${props => sizeStyles[props.size]}
`
export default Button
