import React from 'react'
import styled from 'styled-components'
import { margin } from '../style-utils'

const Spacer = styled.div`
  ${props => props.inline && 'display: inline-block;'}
  ${margin}
`

export default Spacer
