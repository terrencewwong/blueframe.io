// @flow
import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import withState from '../with-state'
import Autocomplete from '../autocomplete'

const StatefulAutocomplete = withState(Autocomplete, {
  onValueChange: 'value'
})

storiesOf('Autocomplete', module)
  .add('default', () =>
    <StatefulAutocomplete
      items={['Button', 'Input', 'Text']}
      onValueChange={value => console.log(`onValueChange - ${value}`)}
    />
  )
