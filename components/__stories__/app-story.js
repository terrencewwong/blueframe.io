// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import App from '../app'

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

storiesOf('App', module)
  .add('default', () =>
    <App
      componentMap={componentMap}
      lines={lines}
    />
  )
