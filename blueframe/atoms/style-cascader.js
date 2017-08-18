import React from 'react'
import styled from 'styled-components'
import defaults from '../defaults'

const {
  'font-family': fontFamily,
  'font-size': fontSize,
  'line-height': lineHeight,
  color
} = defaults

const font = ({
  theme,
  'font-family': fontFamily,
  'font-size': fontSize,
  'line-height': lineHeight,
  color
}) => {
  fontFamily = fontFamily || theme['font-family'] || defaults['font-family']
  fontSize = fontSize || theme['font-size'] || defaults['font-size']
  lineHeight = lineHeight || theme['line-height'] || defaults['line-height']
  color = color || theme['color'] || defaults['color']

  return `
    font-family: ${fontFamily};
    font-size: ${fontSize};
    line-height: ${lineHeight};
    color: ${color};
  `
}

const StyleCascader = styled.div`
  -webkit-font-smoothing: antialiased;
  ${font}

  * {
    box-sizing: border-box;
  }
`

export default StyleCascader
