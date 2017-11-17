// @flow
import React from 'react'
import Line from './line'
import Monospace from './monospace'
import PlainText from './plain-text'
import { ENTER, ESC } from './keycodes'

class AutofocusInput extends React.Component<*> {
  input: ?HTMLInputElement

  componentDidMount () {
    this.input && this.input.focus()
  }

  componentWillUnmount () {
  }

  render () {
    return <input {...this.props} ref={input => this.input = input} />
  }
}

export default class StringEditor extends React.Component<{
  value: string,
  isEditing: boolean,
  onValueChange?: (value: string) => void,
  onKeyDown?: (e: Event) => void,
  onToggleEdit?: () => void
}>{
  static defaultProps = {
    isEditing: false
  }

  handleToggleEdit = () => {
    const { onToggleEdit } = this.props
    onToggleEdit && onToggleEdit()
  }

  handleKeyDown = (e: Event) => {
    const { onKeyDown } = this.props

    if (e.keyCode === ENTER || e.keyCode === ESC) {
      this.handleToggleEdit()
    }

    onKeyDown && onKeyDown(e)
  }

  render () {
    const { value, isEditing, onValueChange } = this.props

    return isEditing ? (
      <AutofocusInput
        type='text'
        value={value}
        onChange={e => onValueChange && onValueChange(e.target.value)}
        onBlur={this.handleToggleEdit}
        onKeyDown={this.handleKeyDown}
      />
    ) : (
      <Monospace
        onDoubleClick={this.handleToggleEdit}
      >
        <PlainText>{value}</PlainText>
      </Monospace>
    )
  }
}
