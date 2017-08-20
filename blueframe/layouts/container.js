import React from 'react'
import styled from 'styled-components'
import { padding } from '../style-utils'
import defaults from '../defaults'

const dimensions = ({
  theme = {},
  size,
  'preferred-width': preferredWidth,
  width,
  height
}) => {
  if (size === 'viewport') {
    return 'width: 100vw; height: 100vh;'
  } else if (size === 'fill') {
    return 'width: 100%; height: 100%;'
  } else if (preferredWidth) {
    return `
      width: ${preferredWidth};
      max-width: ${preferredWidth};
    `
  }

  width = width || theme.sizes && theme.sizes[size] || defaults.sizes[size] + 'px'
  height = height ? defaults.sizes[height] + 'px' : '100%'

  let css = ''
  css += width ? `width: ${width};` : ''
  css += height ? `height: ${height};` : ''

  return css
}

const background = ({ theme = {}, bg }) => {
  if (!bg) return ''

  const color = theme.colors && theme.colors[bg] || bg
  return `background-color: ${color};`
}

const centering = props => {
  let rules = ''
  const centerHorizontal = props['center-horizontal']
  const centerVertical = props['center-vertical']

  if (centerHorizontal) {
    rules += 'justify-content: center;'
  }

  if (centerVertical) {
    rules += 'align-items: center;'
  }

  return rules
}

export const BareContainer = styled.div`
  box-sizing: border-box;
  ${padding}
  ${background}
`

const OuterContainer = styled(BareContainer)`
  display: flex;
  ${dimensions}
  ${centering}
  ${props => props.additionalCSS}
`

const Fill = styled.div`
  width: 100%;
  height: 100%;
`
const CenteredText = styled(Fill)`
  text-align: center;
`

const Container = ({
  children,
  'center-text': centerText,
  ...rest
}) => {
  const InnerContainer = centerText ? CenteredText : Fill

  // TODO: fix this so it's less shitty
  if (rest['center-horizontal'] || rest['center-vertical']) {
    return (
      <OuterContainer {...rest}>
        {children}
      </OuterContainer>
    )
  }

  return (
    <OuterContainer {...rest}>
      <InnerContainer>
        {children}
      </InnerContainer>
    </OuterContainer>
  )
}

export default Container
