// @flow
import React, { Component } from 'react'
import EnumInput from './enum-input'

import type { ComponentType } from 'react'
import type { PropType } from '../../types/components'
import type { DOMEvent } from '../../types/dom'

const typeToComponentMap = {
  enum: EnumInput,
  number: props => <input type='number' {...props} />,
  string: props => <input type='text' {...props} />
}

class PropValueInput extends Component<{
  type: PropType,
  defaultValue: *,
  value: *,
  values: ?Array<*>,
  onKeyDown: (e: Event) => void,
  onChange: (e: DOMEvent<HTMLInputElement>) => void
}> {
  render () {
    const { type, defaultValue, value, ...rest } = this.props

    // $FlowFixMe
    const Component = typeToComponentMap[type]

    if (!Component) {
      throw new Error(`PropType: ${type} cannot be rendered as a PropValueInput`)
    }

    const inputProps = {
      value: value || defaultValue
    }

    return <Component {...inputProps} {...rest} />
  }
}
export default PropValueInput
