import React from 'react'
import styled from 'styled-components'

const CheckboxWrapper = styled.label`
  display: block;
  width: 24px;
  height: 24px;
  position: relative;
  background-color: white;
  border-radius: 2px;
  cursor: pointer;

  > input {
    opacity: 0;
    cursor: pointer;
  }
`

const Checkmark = styled.div`
  opacity: ${props => props.checked ? 1: 0};
  width: 7px;
  height: 12px;
  box-shadow: 2px 2px #979797;
  transform: rotate(45deg);
  position: absolute;
  left: 8px;
  top: 2px;
`

const Checkbox = ({ onChange, checked }) => (
  <CheckboxWrapper>
    <input type='checkbox' onChange={onChange} />
    <Checkmark checked={checked} />
  </CheckboxWrapper>
)

export default Checkbox
