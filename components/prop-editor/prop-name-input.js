// @flow
import React, { Component } from 'react'
import Autocomplete from '../autocomplete'
import type { PropDefinition } from '../types/components'

export default class TagNameInput extends Component<{
  propDefinitions: PropDefinition[],
  onInputKeyDown: (e: Event) => void
}> {
  render () {
    const { propDefinitions, ...rest } = this.props
    return (
      <Autocomplete
        items={propDefinitions}
        getItemValue={componentDefinition => componentDefinition.name}
        {...rest}
      />
    )
  }
}
