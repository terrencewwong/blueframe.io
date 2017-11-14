// @flow
import React, { Component } from 'react'
import PropNameInput from './prop-name-input'
import PropValueInput from './prop-value-input'
import { TAB } from '../keycodes'
import type { PropDefinition } from '../types/components'

class PropInput extends Component<{
  name: string,
  value: any,
  propDefinitions: PropDefinition[],
  matchedDefinition: ?PropDefinition,
  onPropNameChange: (name: string) => void,
  onPropValueChange: (value: any) => void,
  onInputKeyDown: (e: Event) => void,
  onComponentBlur: () => void
}> {
  handleBlur = (e: Event) => {
    const { onComponentBlur } = this.props
    onComponentBlur && onComponentBlur()
  }

  handleNameInputKeyDown = (e: Event) => {
    if (!e.shiftKey && e.keyCode === TAB) return

    const { onInputKeyDown } = this.props
    onInputKeyDown && onInputKeyDown(e)
  }

  handleValueInputKeyDown = (e: Event) => {
    if (e.shiftKey && e.keyCode === TAB) return

    const { onInputKeyDown } = this.props
    onInputKeyDown && onInputKeyDown(e)
  }

  doNotTriggerWindowBlur = (e: Event) => e.stopPropagation()

  componentWillMount () {
    window.addEventListener('click', this.handleBlur)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.handleBlur)
  }

  render () {
    const {
      name,
      value,
      propDefinitions,
      matchedDefinition,
      onPropNameChange,
      onPropValueChange,
      onInputKeyDown
    } = this.props

    const valueComponent = matchedDefinition ? (
      <span>
        <span>&nbsp;=&nbsp;</span>
        <PropValueInput
          {...matchedDefinition}
          value={value}
          onKeyDown={this.handleValueInputKeyDown}
          onChange={e => onPropValueChange(e.target.value)}
        />
      </span>
    ) : null

    return (
      <span onClick={this.doNotTriggerWindowBlur}>
        <PropNameInput
          propDefinitions={propDefinitions}
          value={name}
          onInputKeyDown={this.handleNameInputKeyDown}
          onValueChange={onPropNameChange}
        />
        {valueComponent}
      </span>
    )
  }
}


export default PropInput
