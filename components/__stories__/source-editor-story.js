// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import SourceEditor from '../source-editor'

const componentMap = {
  'root': {
    name: 'Text',
    props: [
      {
        name: 'size',
        value: 'm'
      }
    ]
  },
  'child': 'Hello, world!'
}

const lines = [
  {
    id: 'root',
    tag: 'opening'
  },
  {
    id: 'child',
    tag: 'string'
  },
  {
    id: 'root',
    tag: 'closing'
  }
]

storiesOf('SourceEditor', module)
  .add('default', () =>
    <SourceEditor
      componentMap={componentMap}
      lines={lines}
    />
  )
