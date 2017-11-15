// @flow
import React from 'react'
import SubTreeEditor from './sub-tree-editor'
import { componentDefinitionMap } from '../defaults'
import { ENTER, ESC, UP, DOWN } from '../keycodes'
import type { Component, ComponentMap, ComponentDefinitionMap } from '../types/components'

export default class SourceEditor extends React.Component<{
  componentMap: ComponentMap,
  componentDefinitionMap: ComponentDefinitionMap,
  onComponentChange?: (id: string, component: Component | string) => void,
}, {
  currentLine: ?number,
  shouldFocusCurrentLine: boolean
}> {
  __totalLines: number = 0
  currentLineElement: ?HTMLElement

  static defaultProps = {
    componentDefinitionMap
  }

  state = {
    currentLine: null,
    shouldFocusCurrentLine: false
  }

  handleLineClick = (line: number) => {
    this.setState({ currentLine: line })
  }

  handleLineKeyDown = (e: Event) => {
    // HACK - dont do anything if keydown is used inside an autocomplete
    // $FlowFixMe
    const isTargetingAutocomplete = e.target.getAttribute('role') === 'combobox'

    const { currentLine } = this.state
    if (currentLine === null || typeof currentLine === 'undefined') return

    if (e.keyCode === UP) {
      // TODO: get rid of this repetition
      if (isTargetingAutocomplete) {
        e.preventDefault()
        return
      }

      this.setState({ currentLine: Math.max(0, currentLine - 1) })
    } else if (e.keyCode === DOWN) {
      // TODO: get rid of this repetition
      if (isTargetingAutocomplete) {
        e.preventDefault()
        return
      }

      this.setState({ currentLine : Math.min(currentLine + 1, this.__totalLines - 1) })
    }
  }

  handleComponentKeyDown = (e: Event) => {
    if (e.keyCode === ENTER || e.keyCode === ESC) {
      this.currentLineElement && this.currentLineElement.focus()
    }
  }

  render () {
    const {
      componentMap,
      componentDefinitionMap,
      onComponentChange
    } = this.props
    const { currentLine, shouldFocusCurrentLine } = this.state

    return (
      <SubTreeEditor
        componentMap={componentMap}
        componentDefinitionMap={componentDefinitionMap}
        onComponentChange={onComponentChange}
        onLineClick={this.handleLineClick}
        onLineKeyDown={this.handleLineKeyDown}
        onComponentKeyDown={this.handleComponentKeyDown}
        currentLine={currentLine}
        currentLineRef={currentLineElement => {
          this.currentLineElement = currentLineElement
        }}
        __reportTotalLinesAfterRender={lines => {
          this.__totalLines = lines
        }}
        shouldFocusCurrentLine={shouldFocusCurrentLine}
      />
    )
  }
}
