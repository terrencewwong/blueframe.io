// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import withState from '../with-state'
import StringEditor from '../string-editor'

const StatefulStringEditor = withState(StringEditor, {
  onValueChange: 'value'
})

storiesOf('StringEditor', module)
  .add('default', () =>
    <StatefulStringEditor
      value='Hello, world!'
      onValueChange={value => console.log(`onValueChange - ${value}`)}
    />
  )
