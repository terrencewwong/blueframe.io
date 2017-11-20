// @flow
import React from 'react'
import Line from './line'
import StringEditor from './string-editor'
import ComponentEditor from './component-editor'
import ClosingTag from './closing-tag'
import { BACKSPACE, cKey, ENTER, DOWN, UP } from './keycodes'
import type { Component, ComponentMap, TagType } from './types/components'

export type LineInfo = {
  id: string,
  tag: TagType
}

export default class SourceEditor extends React.Component<{
  componentMap: ComponentMap,
  lines: LineInfo[],
  onComponentChange?: (id: string, component: Component | string) => void,
  onLinesChange?: (lines: LineInfo[]) => void
}, {
  currentLine: ?number,
  currentEditingPropIndex: ?number
}> {
  state = {
    currentLine: null,
    currentEditingPropIndex: null
  }

  insertChild = (componentType: 'component' | 'string') => {
    const { lines } = this.props
    const { currentLine } = this.state

    if (typeof currentLine !== 'number') {
      throw new Error('Cannot add child when there is no current line!')
    }

    const { tag: tag } = lines[currentLine]

    if (tag === 'string' || tag === 'self-closing') {
      /// 'LOL you cant add a child to this component!'
      return
    }

    const id = Date.now().toString()

    const duplicated = [ ...lines ]

    let spliceArguments
    if (componentType === 'component') {
      spliceArguments = [
        0, // This is a hack to make flow stop complaining
        0,
        {
          id,
          tag: 'opening'
        },
        {
          id,
          tag: 'closing'
        }
      ]
    } else {
      spliceArguments = [
        0, // This is a hack to make flow stop complaining
        0,
        {
          id,
          tag: 'string'
        }
      ]
    }

    if (tag === 'opening') {
      spliceArguments[0] = currentLine + 1
    } else if (tag === 'closing') {
      spliceArguments[0] = currentLine
    } else {
      throw new Error(`Unrecognized tag: ${tag} for id: ${id}`)
    }

    [].splice.apply(duplicated, spliceArguments)

    // TODO: omg this is terrible
    if (componentType === 'component') {
      // TODO: should be element picker
      this.handleComponentChange(id, {
        name: 'Text',
        props: []
      })
    } else {
      // TODO: should be a string in edit mode...
      this.handleComponentChange(id, 'Hello, world!')
    }

    this.handleLinesChange(duplicated)

  }

  handleAddChild = () => {
    this.insertChild('component')
  }

  handleAddStringChild = () => {
    this.insertChild('string')
  }

  handleDeleteCurrentLine = () => {
    const { lines } = this.props
    const { currentLine } = this.state

    if (typeof currentLine !== 'number') {
      throw new Error('Cannot delete current line when there is no current line.')
    }

    const duplicated = [ ...lines ]
    const { id, tag } = lines[currentLine]

    if (tag === 'string' || tag === 'self-closing') {
      duplicated.splice(currentLine, 1)
      // TODO: should we delete the component from the componentMap?
      this.handleLinesChange(duplicated)
      this.setState({ currentLine: currentLine - 1 })
      return
    }

    const matchingTagIndex = lines.findIndex(line => {
      if (id === line.id && tag === 'opening' && line.tag === 'closing') return true
      if (id === line.id && tag === 'closing' && line.tag === 'opening') return true
    })

    if (!matchingTagIndex) {
      throw new Error(`There is no mathing tag for id: ${id} tag: ${tag}.`)
    }

    const deleteCount = Math.abs(currentLine - matchingTagIndex) + 1
    const start = Math.min(currentLine, matchingTagIndex)
    const nextCurrentLine = start === 0
      ? null
      : start - 1

    duplicated.splice(start, deleteCount)

    this.handleLinesChange(duplicated)
    this.setState({ currentLine: nextCurrentLine })
  }

  handleLineClick = (line: number) => {
    this.setState({
      currentLine: line,
      currentEditingPropIndex: null
    })
  }

  handleComponentChange = (id: string, component: *) => {
    const { onComponentChange } = this.props
    onComponentChange && onComponentChange(id, component)
  }

  handleLinesChange = (lines: LineInfo[]) => {
    const { onLinesChange } = this.props
    onLinesChange && onLinesChange(lines)
  }

  handleEditPropIndexChange = (index: ?number) => {
    this.setState({ currentEditingPropIndex: index })
  }

  handleStringEditorToggleEdit = () => {
    // TODO: hmmm this is a hack, maybe we should have two states?
    const { currentEditingPropIndex } = this.state
    typeof currentEditingPropIndex !== 'number'
      ? this.setState({ currentEditingPropIndex: 0 })
      : this.setState({ currentEditingPropIndex: null })
  }

  handleKeyDown = (e: Event) => {
    // TODO: come up with a better solution
    // HACK: if we're targeting the tag name or prop editor
    // then we don't want to change the current line
    // $FlowFixMe
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
      return
    }

    const { lines } = this.props
    const { currentLine } = this.state

    // TODO: make something more configurable for
    // adding functionality for key down events
    if (e.keyCode === BACKSPACE) {
      this.handleDeleteCurrentLine()
    }  else if (e.keyCode === ENTER) {
      // Start editing a prop
      this.setState({ currentEditingPropIndex: 0 })
    } else if (e.shiftKey && e.keyCode === cKey) {
      this.handleAddStringChild()
    } else if (e.keyCode === cKey) {
      this.handleAddChild()
    } else if (e.keyCode === DOWN) {
      if (typeof currentLine !== 'number') {
        this.setState({
          currentLine: 0,
          currentEditingPropIndex: null
        })
      } else {
        this.setState({
          currentLine: Math.min(currentLine + 1, lines.length - 1),
          currentEditingPropIndex: null
        })
      }
    } else if (e.keyCode === UP) {
      if (typeof currentLine !== 'number') {
        this.setState({
          currentLine: lines.length - 1,
          currentEditingPropIndex: null
        })
      } else {
        this.setState({
          currentLine: Math.max(0, currentLine - 1),
          currentEditingPropIndex: null
        })
      }
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  render () {
    const { lines, componentMap } = this.props
    const { currentLine, currentEditingPropIndex } = this.state

    let depth = 0

    const renderedLines = lines.map(({ id, tag }, index) => {
      const component = componentMap[id]
      const active = index === currentLine
      let rendered
      if (typeof component === 'string') {
        rendered = (
          <Line
            key={'line-' + id + '-' + tag}
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={active}
          >
            <StringEditor
              value={component}
              isEditing={active ? typeof currentEditingPropIndex === 'number' : false}
              onValueChange={value => this.handleComponentChange(id, value)}
              onToggleEdit={this.handleStringEditorToggleEdit}
            />
          </Line>
        )
      } else if (tag === 'opening') {
        rendered = (
          <Line
            key={'line-' + id + '-' + tag}
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={active}
          >
            <ComponentEditor
              {...component}
              editingPropIndex={active ? currentEditingPropIndex : null}
              onComponentChange={component => this.handleComponentChange(id, component)}
              onEditPropIndexChange={this.handleEditPropIndexChange}
            />
          </Line>
        )
        depth = depth + 1

      } else if (tag === 'self-closing') {
        rendered = (
          <Line
            key={'line-' + id + '-' + tag}
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={index === currentLine}
          >
            <ComponentEditor
              {...component}
              selfClosing
              editingPropIndex={active ? currentEditingPropIndex : null}
              onComponentChange={component => this.handleComponentChange(id, component)}
              onEditPropIndexChange={this.handleEditPropIndexChange}
            />
          </Line>
        )
      } else if (tag === 'closing') {
        depth = depth - 1
        rendered = (
          <Line
            key={'line-' + id + '-' + tag}
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={index === currentLine}
          >
            <ClosingTag name={component.name} />
          </Line>
        )
      } else {
        throw new Error(`unrecognized id: ${id} tag: ${tag}`)
      }

      return rendered
    })

    return (
      <div>
        {renderedLines}
      </div>
    )
  }
}
