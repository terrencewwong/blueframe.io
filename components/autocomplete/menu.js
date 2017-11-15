// @flow
import styled from 'styled-components'

const Menu = styled.div`
  position: fixed;
  margin-top: 4px;
  min-width: 147px;
  background-color: white;
  font-family: Menlo, monospace;
  font-size: 11px;
  line-height: 13px;
  ${props => props.children && props.children.length ? `
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2),
                0 2px 4px rgba(0, 0, 0, 0.2),
                0 2px 6px rgba(0, 0, 0, 0.1);
  ` : ''}
`
export default Menu
