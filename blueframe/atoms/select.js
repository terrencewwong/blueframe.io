import React from 'react'
import styled from 'styled-components'
import { unit } from '../defaults'

const SelectWrapper = styled.select`
  width: ${props => props.width};
  appearance: none;
  color: inherit;
  border: none;
  border-radius: 2px;
  background-color: white;
  height: ${4 * unit}px;
  padding: ${unit / 2}px ${1.5 * unit}px;
  font: inherit;
  background-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3Csvg width='10px' height='6px' viewBox='0 0 10 6' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3C/defs%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpolyline id='Path-2' stroke='%23979797' stroke-width='1.5' points='9 1 5 5 1 1'%3E%3C/polyline%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center right ${1.5 * unit}px;
  cursor: pointer;
  
  &:focus {
    outline: 0;
  }
`

const Select = ({ options, ...rest }) => {
  options = options.map(option => <option key={option}>{option}</option>)
  return <SelectWrapper {...rest}>{options}</SelectWrapper>
}

export default Select
