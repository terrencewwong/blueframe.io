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
  onValueChange?: (value: string) => void,
  onKeyDown?: (e: Event) => void
}, {
  isEditing: boolean
}>{
  state = {
    isEditing: false
  }

  toggleEdit = () => this.setState({ isEditing: !this.state.isEditing })

  handleKeyDown = (e: Event) => {
    const { onKeyDown } = this.props

    if (e.keyCode === ENTER || e.keyCode === ESC) {
      this.toggleEdit()
    }

    onKeyDown && onKeyDown(e)
  }

  render () {
    const { value, onValueChange } = this.props

    const { isEditing } = this.state
    return isEditing ? (
      <AutofocusInput
        type='text'
        value={value}
        onChange={e => onValueChange && onValueChange(e.target.value)}
        onBlur={this.toggleEdit}
        onKeyDown={this.handleKeyDown}
      />
    ) : (
      <Monospace
        onDoubleClick={this.toggleEdit}
      >
        <PlainText>{value}</PlainText>
      </Monospace>
    )
  }
}
