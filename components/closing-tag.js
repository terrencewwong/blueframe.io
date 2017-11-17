// @flow
import React from 'react'
import Monospace from './monospace'
import TagNameText from './tag-name-text'

const ClosingTag = ({
  name
}: {
  name: string
}) => (
  <Monospace>
    {'</'}
    <TagNameText>{name}</TagNameText>
    {'>'}
  </Monospace>
)
export default ClosingTag
