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
const weightStyles = {
  normal: `
    font-weight: normal;
  `,
  bold: `
    font-weight: 500;
  `,
  bolder: `
    font-weight: 700;
  `
}
const Text = styled.div`
  ${props => sizeStyles[props.size]}
  ${props => weightStyles[props.weight]}
`
export default Text
