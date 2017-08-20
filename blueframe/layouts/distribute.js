import React from 'react'
import styled from 'styled-components'

const ALIGN = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end'
}

const Distribute = styled.div`
  display: flex;
  align-items: ${props => ALIGN[props.align]};

  & > * {
    flex: 0 0 auto;

    &:not(:last-child) {
      ${props => props.vertical
        ? 'margin-bottom:' + props.space * 8 + 'px'
        : 'margin-right:' + props.space * 8 + 'px'
      };
    }
  }
  
  ${props => props.vertical ? 'flex-direction: column' : ''}
`
Distribute.defaultProps = {
  align: 'start'
}
Distribute.displayName = 'Distribute'

export default Distribute
