import styled from 'styled-components'
import { unit } from '../defaults'

const DistributeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  ${props => props.vertical && 'flex-direction: column;'}

  > * {
    width: 100%;

    :not(:first-child) {
      padding-top: ${props => props.space / 2 * unit}px;
    }

    :not(:last-child) {
      padding-bottom: ${props => props.space  / 2 * unit - Number(!!props.dividers)}px;
      border-bottom: 1px solid #D8D8D8;
    }
  }
`

const Distribute = ({ children, vertical, space, dividers }) => {
  const wrappedChildren = children.map(child => <div>{child}</div>)

  return (
    <DistributeContainer
      vertical={vertical}
      space={space}
      dividers={dividers}
    >
      {wrappedChildren}
    </DistributeContainer>
  )
}

Distribute.displayName = 'Distribute'
export default Distribute
