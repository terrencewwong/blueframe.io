// @flow
import styled from 'styled-components'

const MenuItem = styled.div`
  background-color: ${props => props.isHighlighted ? 'rgba(56, 121, 217, 0.1)' : 'white'};
  ${props => props.error ? 'color: #e61313' : ''};
  padding-left: 2px;
`
export default MenuItem
