// @flow
import React from 'react'
import TagNameEditor from './tag-name-editor'
import PropEditor from './prop-editor'
import Monospace from './monospace'
import { TAB } from './keycodes'
import { componentDefinitionMap } from './defaults'
import type { ComponentDefinitionMap, PropDefinition } from './types/components'

import type { Component, Prop } from './types/components'

class ComponentEditor extends React.Component<{
  componentDefinitionMap: ComponentDefinitionMap,
  name: string,
  props: Prop[],
  selfClosing: boolean,
  onComponentChange?: (component: Component) => void,
  onComponentDelete?: () => void
}, {
  isEditingTagName: boolean,
  editingPropIndex: ?number
}> {
  static defaultProps = {
    componentDefinitionMap,
    props: []
  }

  state = {
    isEditingTagName: false,
    editingPropIndex: null
  }

  _getPropDefinitions (): ?PropDefinition[] {
    const { componentDefinitionMap, name } = this.props
    const matchedComponent = componentDefinitionMap[name]
    return matchedComponent && matchedComponent.propDefinitions
  }

  handleComponentNameChange = (name: string) => {
    const { props, onComponentChange } = this.props

    onComponentChange && onComponentChange({
      name,
      props
    })
  }

  handleTagNameToggleEdit = () => {
    this.setState({ isEditingTagName: !this.state.isEditingTagName })
  }

  handlePropToggleEdit = (index: number) => {
    const { editingPropIndex } = this.state
    editingPropIndex === null
      ? this.setState({ editingPropIndex: index })
      : this.setState({ editingPropIndex: null })
  }
 
  handleComponentPropChange = (index: number, prop: Prop) => {
    const { name, props, onComponentChange } = this.props

    const newProps = [
      ...props.slice(0, index),
      prop,
      ...props.slice(index + 1, props.length)
    ]

    onComponentChange && onComponentChange({
      name,
      props: newProps
    })
  }

  handleTagNameDelete = () => {
    const { onComponentDelete } = this.props
    onComponentDelete && onComponentDelete()
  }

  handlePropDelete = (index: number) => {
    const { name, props, onComponentChange } = this.props
    const newProps = [
      ...props.slice(0, index),
      ...props.slice(index + 1, props.length)
    ]

    onComponentChange && onComponentChange({
      name,
      props: newProps
    })
  }

  handleTagNameKeyDown = (e: Event) => {
    const { props } = this.props
    if (e.keyCode === TAB) {
      e.preventDefault()
      e.shiftKey
        ? this.setState({ editingPropIndex: props.length - 1 })
        : this.setState({ editingPropIndex: 0 })
    }
  }

  handlePropKeyDown = (e: Event) => {
    const { props } = this.props
    const { editingPropIndex } = this.state

    if (e.keyCode === TAB) {
      e.preventDefault()

      if (editingPropIndex === null || typeof editingPropIndex === 'undefined') {
        throw new Error('Cannot set move edit when editingPropIndex does not exist.')
      }

      if (e.shiftKey) {
        editingPropIndex === 0
          ? this.setState({ isEditingTagName: true, editingPropIndex: null })
          : this.setState({ editingPropIndex: editingPropIndex - 1 })
      } else {
        const propDefinitions = this._getPropDefinitions() || []

        editingPropIndex === props.length - 1 && props.length === propDefinitions.length
          ? this.setState({ isEditingTagName: true, editingPropIndex: null })
          : this.setState({ editingPropIndex: editingPropIndex + 1 })
      }
    }
  }

  renderProps () {
    const { componentDefinitionMap, name, props } = this.props
    const { editingPropIndex } = this.state

    // We must be adding a new prop!
    // Should this be in render...?
    if (editingPropIndex === props.length) {
      props.push({ name: '', value: undefined })
    }

    return props.map((prop, index) =>
      <span key={index}>
        &nbsp;
        <PropEditor
          {...prop}
          usedProps={props}
          componentDefinitionMap={componentDefinitionMap}
          component={name}
          isEditing={editingPropIndex === index}
          onKeyDown={this.handlePropKeyDown}
          onPropChange={prop => this.handleComponentPropChange(index, prop)}
          onToggleEdit={() => this.handlePropToggleEdit(index)}
          onPropDelete={() => this.handlePropDelete(index)}
        />
      </span>
    )
  }

  render () {
    const { componentDefinitionMap, name, selfClosing } = this.props
    const { isEditingTagName } = this.state

    return (
      <Monospace>
        {'<'}
        <TagNameEditor
          componentDefinitionMap={componentDefinitionMap}
          isEditing={isEditingTagName}
          name={name}
          onNameChange={this.handleComponentNameChange}
          onKeyDown={this.handleTagNameKeyDown}
          onToggleEdit={this.handleTagNameToggleEdit}
          onTagNameDelete={this.handleTagNameDelete}
        />
        {this.renderProps()}
        { selfClosing ? '/>' : '>'}
      </Monospace>
    )
  }
}

export default ComponentEditor
