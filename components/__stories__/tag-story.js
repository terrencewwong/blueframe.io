// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import Tag from '../tag'

storiesOf('Tag', module)
  .add('default', () => <Tag id='foo' name='Text' attributes={[]} />)
