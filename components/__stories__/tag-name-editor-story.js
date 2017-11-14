// @flow
import React, { Component } from 'react'
import { storiesOf } from '@storybook/react'
import withState from '../with-state'
import TagNameEditor from '../tag-name-editor'

const StatefulTagNameEditor = withState(TagNameEditor, {
  onNameChange: 'name'
})

storiesOf('TagNameEditor', module)
  .add('default', () =>
    <StatefulTagNameEditor
      name='Text'
      onNameChange={name => console.log(`onNameChange - ${name}`)}
    />
  )
