// @flow
import styled from 'styled-components'
const Monospace = styled.span.attrs({
  className: 'monospace'
})`
  font-family: Menlo, monospace;
  font-size: 11px;
  color: ${props => props.plainText ? 'black' : '#a894a6'};
  cursor: default;
`
export default Monospace
