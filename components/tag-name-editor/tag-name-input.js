// @flow
import React, { Component } from 'react'
import Autocomplete from '../autocomplete'
import type { ComponentDefinitionMap } from '../types/components'

type Props = {
  componentDefinitionMap: ComponentDefinitionMap
}
export default class TagNameInput extends Component<Props> {
  render () {
    const { componentDefinitionMap } = this.props
    const items = Object.values(componentDefinitionMap)

    return (
      <Autocomplete
        items={items}
        getItemValue={componentDefinition => componentDefinition.name}
        {...this.props}
      />
    )
  }
}
