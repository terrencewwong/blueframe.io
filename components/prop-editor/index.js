// @flow
import React, { Component } from 'react'
import { ENTER, ESC, TAB } from '../keycodes'
import PropInput from './prop-input'
import { componentDefinitionMap } from '../defaults'
import type { ComponentDefinitionMap, Prop, PropDefinition } from '../types/components'

// TODO: actually implement this
const PropText = props => <span {...props} />

class PropEditor extends Component<{
  component: string,
  isEditing?: boolean,
  name: string,
  value?: any,
  usedProps: Prop[],
  componentDefinitionMap: ComponentDefinitionMap,
  onKeyDown?: (e: Event) => void,
  onPropChange?: (prop: Prop) => void,
  onPropDelete?: () => void,
  onToggleEdit?: () => void
}> {
  static defaultProps = {
    componentDefinitionMap,
    isEditing: false,
    usedProps: []
  }

  _getPropDefinitions (name: ?string): {
    propDefinitions: PropDefinition[],
    match: ?PropDefinition
  } {
    const { component, usedProps, componentDefinitionMap } = this.props
    name = name || this.props.name

    const matchedComponent = componentDefinitionMap[component]
    if (!matchedComponent) {
      throw new Error(`Cannot render a prop input for unknown component: ${component}.`)
    }

    const matchedDefinitions = matchedComponent.propDefinitions

    if (!matchedDefinitions) {
      throw new Error(`Cannot render a prop input for component that does not accept props: ${component}.`)
    }

    // Only want to show props that have not been used
    const propDefinitions = matchedDefinitions.filter(propDef => {
      // its okay to include the prop that is being edited
      if (propDef.name === name) return true

      return !usedProps.find(usedProp => usedProp.name === propDef.name)
    })

    const match = propDefinitions
      .find(propDef => propDef.name.toLowerCase() === (name && name.toLowerCase()))

    return {
      propDefinitions,
      match
    }
  }

  handleKeyDown = (e: Event) => {
    const { name, onKeyDown, onPropDelete } = this.props
    if (e.keyCode === ENTER || e.keyCode === ESC || e.keyCode === TAB) {
      this.toggleEdit()

      if (!name) {
        onPropDelete && onPropDelete()
        return
      }
    }

    onKeyDown && onKeyDown(e)
  }

  handlePropNameChange = (name: string) => {
    const { onPropChange, value } = this.props
    const { match } = this._getPropDefinitions(name)

    let prop 
    if (match) {
      prop = {
        name,
        value: match.defaultValue
      }
    } else {
      prop = { name, value: undefined }
    }

    onPropChange && onPropChange(prop)
  }

  handlePropValueChange = (value: any) => {
    const { onPropChange, name } = this.props
    onPropChange && onPropChange({ name, value })
  }

  toggleEdit = () => {
    const { onToggleEdit } = this.props
    onToggleEdit && onToggleEdit()
  }

  handleComponentBlur = () => {
    const { name, onPropDelete } = this.props
    this.toggleEdit()
    if (!name) {
      onPropDelete && onPropDelete()
    }
  }

  renderPropInput () {
    const { name, value, onPropChange } = this.props
    const { propDefinitions, match } = this._getPropDefinitions()

    return (
      <PropInput
        name={name}
        value={value}
        propDefinitions={propDefinitions}
        matchedDefinition={match}
        onPropNameChange={this.handlePropNameChange}
        onPropValueChange={this.handlePropValueChange}
        onInputKeyDown={this.handleKeyDown}
        onComponentBlur={this.handleComponentBlur}
      />
    )
  }

  renderValueText () {
    const { value } = this.props
    if (value === true) return null

    let valueString
    if (typeof value === 'string') {
      valueString = `='${value}'`
    } else {
      valueString = `={${JSON.stringify(value)}}`
    }

    return (
      <span>{valueString}</span>
    )
  }

  render () {
    const { name, value, isEditing } = this.props

    return isEditing ? this.renderPropInput() : (
      <span onDoubleClick={this.toggleEdit}>
        <PropText>{name}</PropText>
        {this.renderValueText()}
      </span>
    )
  }
}

export default PropEditor
