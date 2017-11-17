// @flow
import React from 'react'
import Line from './line'
import StringEditor from './string-editor'
import ComponentEditor from './component-editor'
import ClosingTag from './closing-tag'
import { DOWN, UP } from './keycodes'
import type { Component, ComponentMap, TagType } from './types/components'

export type LineInfo = {
  id: string,
  tag: TagType
}

export default class SourceEditor extends React.Component<{
  componentMap: ComponentMap,
  lines: LineInfo[],
  onComponentChange?: (id: string, component: Component | string) => void
}, {
  currentLine: ?number
}> {
  state = {
    currentLine: null
  }

  handleLineClick = (line: number) => {
    this.setState({ currentLine: line })
  }

  handleComponentChange = (id: string, component: *) => {
    const { onComponentChange } = this.props
    onComponentChange && onComponentChange(id, component)
  }

  handleKeyDown = (e: Event) => {
    const { lines } = this.props
    const { currentLine } = this.state

    if (e.keyCode === DOWN) {
      if (typeof currentLine !== 'number') {
        this.setState({ currentLine: 0 })
      } else {
        this.setState({
          currentLine: Math.min(currentLine + 1, lines.length - 1)
        })
      }
    } else if (e.keyCode === UP) {
      if (typeof currentLine !== 'number') {
        this.setState({ currentLine: lines.length - 1 })
      } else {
        this.setState({
          currentLine: Math.max(0, currentLine - 1)
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
    const { currentLine } = this.state

    let depth = 0

    const renderedLines = lines.map(({ id, tag }, index) => {
      const component = componentMap[id]
      let rendered
      if (typeof component === 'string') {
        rendered = (
          <Line
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={index === currentLine}
          >
            <StringEditor
              value={component}
              onValueChange={value => this.handleComponentChange(id, value)}
            />
          </Line>
        )
      } else if (tag === 'opening') {
        rendered = (
          <Line
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={index === currentLine}
          >
            <ComponentEditor
              {...component}
              onComponentChange={component => this.handleComponentChange(id, component)}
            />
          </Line>
        )
        depth = depth + 1

      } else if (tag === 'self-closing') {
        rendered = (
          <Line
            depth={depth}
            onClick={() => this.handleLineClick(index)}
            active={index === currentLine}
          >
            <ComponentEditor
              {...component}
              selfClosing
              onComponentChange={component => this.handleComponentChange(id, component)}
            />
          </Line>
        )
      } else if (tag === 'closing') {
        depth = depth - 1
        rendered = (
          <Line
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
