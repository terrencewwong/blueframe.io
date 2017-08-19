import React from 'react'
import styled from 'styled-components'
import { Container, Split } from '../../blueframe/layouts'
import SourceCode from '../source-code'
import PropsPanel from '../props-panel'

export default ({ components, currentComponent = 'root', onPropChange }) => (
  <Container size='fill' bg='#f1f1f1'>
    <Split>
      <Split.Content>
        <Container top={2} left={3} right={3} bottom={2}>
          <SourceCode components={components} />
        </Container>
      </Split.Content>
      <Split.Panel
        position='bottom'
        border
      >
        <Container size='fill' top={2} bottom={4} left={4} right={4}>
          <PropsPanel
            component={components[currentComponent]}
            onPropChange={onPropChange}
          />
        </Container>
      </Split.Panel>
    </Split>
  </Container>
)
