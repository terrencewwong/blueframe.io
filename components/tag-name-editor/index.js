// @flow
import React, { Component } from 'react'
import TagNameText from '../tag-name-text'
import { ENTER, ESC } from '../keycodes'
import TagNameInput from './tag-name-input'
import { componentDefinitionMap } from '../defaults'
import type { ComponentDefinitionMap } from '../types/components'

class TagNameEditor extends Component<{
  componentDefinitionMap: ComponentDefinitionMap,
  isEditing: boolean,
  name: string,
  onKeyDown?: (e: Event) => void,
  onNameChange?: (name: string) => void,
  onToggleEdit?: () => void,
  onTagNameDelete?: () => void
}> {
  static defaultProps = {
    componentDefinitionMap,
    isEditing: false
  }

  handleNameChange = (name: string) => {
    const { onNameChange } = this.props
    onNameChange && onNameChange(name)
  }

  handleInputKeyDown = (e: Event) => {
    const { onKeyDown, onTagNameDelete } = this.props

    if (e.keyCode === ENTER || e.keyCode === ESC) {
      this.toggleEdit()
      onTagNameDelete && onTagNameDelete()
      return
    }

    onKeyDown && onKeyDown(e)
  }

  toggleEdit = () => {
    const { onToggleEdit } = this.props
    onToggleEdit && onToggleEdit()
  }

  render () {
    const { componentDefinitionMap, name, isEditing, onNameChange } = this.props

    return isEditing ? (
      <TagNameInput
        componentDefinitionMap={componentDefinitionMap}
        value={name}
        onInputBlur={this.toggleEdit}
        onInputKeyDown={this.handleInputKeyDown}
        onValueChange={this.handleNameChange}
      />
    ) : (
      <TagNameText onDoubleClick={this.toggleEdit}>{name}</TagNameText>
    )
  }
}

export default TagNameEditor
