// @flow
import React from 'react'
import Monospace from '../monospace'
import Line from '../line'
import TagNameText from '../tag-name-text'
import { componentDefinitionMap } from '../defaults'
import ComponentEditor from '../component-editor'
import StringEditor from '../string-editor'
import type { Component, ComponentMap, ComponentDefinitionMap } from '../types/components'

const ClosingTag = ({ name }) => (
  <Monospace>
    {'</'}
    <TagNameText>{name}</TagNameText>
    {'>'}
  </Monospace>
)

class SubTreeEditor extends React.Component<{
  componentId: string,
  componentMap: ComponentMap,
  componentDefinitionMap: ComponentDefinitionMap,
  currentLine: ?number,
  currentLineRef: (elem: ?HTMLDivElement) => *,
  depth: number,
  lineOffset: number,
  onComponentChange?: (id: string, component: Component | string) => void,
  onComponentKeyDown: (e: Event) => void,
  onLineClick?: (line: number) => void,
  onLineKeyDown?: (e: Event) => void,
  __reportTotalLinesAfterRender?: (lines: number) => void
}>{
  __totalSubTreeLines: number = 0

  static defaultProps = {
    componentId: 'root',
    componentDefinitionMap,
    depth: 0,
    lineOffset: 0
  }

  handleComponentChange = (componentId: string, component: Component | string) => {
    const { onComponentChange } = this.props
    onComponentChange && onComponentChange(componentId, component)
  }

  handleLineClick = (line: number) => {
    const { onLineClick } = this.props
    onLineClick && onLineClick(line)
  }

  handleLineKeyDown = (e: Event) => {
    const { onLineKeyDown } = this.props
    onLineKeyDown && onLineKeyDown(e)
  }

  handleReportLines = (lines: number) => {
    const { __reportTotalLinesAfterRender } = this.props
    __reportTotalLinesAfterRender && __reportTotalLinesAfterRender(lines)
  }

  renderChildren (children: string[]) {
    // HACK - reset __totalSubTreeLines
    this.__totalSubTreeLines = 0

    const { depth, lineOffset, ...rest } = this.props
    const subTrees = []

    // line number relies on the fact that
    // we render in an in-order traversal
    // i.e. an entire subtree is rendered before
    // rendering the next child
    for (let child of children) {
      const subTree = (
        <SubTreeEditor
          key={child}
          {...rest}
          componentId={child}
          depth={depth + 1}
          lineOffset={lineOffset + this.__totalSubTreeLines + 1}
          __reportTotalLinesAfterRender={lines => {
            this.__totalSubTreeLines = this.__totalSubTreeLines + lines
          }}
        />
      )
      subTrees.push(subTree)
    }

    return subTrees
  }

  renderCloseTag (name: string) {
    const { currentLine, depth, lineOffset, currentLineRef } = this.props
    return (
      <Line
        depth={depth}
        onClick={() => this.handleLineClick(lineOffset + this.__totalSubTreeLines + 1)}
        onKeyDown={this.handleLineKeyDown}
        calcIsCurrentLine={() => currentLine === lineOffset + this.__totalSubTreeLines + 1}
        innerRef={currentLineRef}
      >
        <ClosingTag name={name} />
      </Line>
    )
  }

  render () {
    const {
      componentId,
      componentMap,
      componentDefinitionMap,
      currentLine,
      depth,
      lineOffset,
      currentLineRef,
      onComponentKeyDown,
      __reportTotalLinesAfterRender
    } = this.props

    const component = componentMap[componentId]

    // CASE 1: component is just a string
    if (typeof component === 'string') {
      this.handleReportLines(1)
      return (
        <Line
          depth={depth}
          onClick={() => this.handleLineClick(lineOffset)}
          onKeyDown={this.handleLineKeyDown}
          calcIsCurrentLine={() => currentLine === lineOffset}
          innerRef={currentLineRef}
        >
          <StringEditor
            value={component}
            onValueChange={component => this.handleComponentChange(componentId, component)}
            onKeyDown={onComponentKeyDown}
          />
        </Line>
      )
    }

    const componentDefinition = componentDefinitionMap[component.name]
    const { selfClosing } = componentDefinition
    const { children = [] } = component

    if (selfClosing && children.length) {
      throw new Error('selfClosing elements cannot have children.')
    }

    const componentEditor = (
      <Line
        depth={depth}
        onClick={() => this.handleLineClick(lineOffset)}
        onKeyDown={this.handleLineKeyDown}
        calcIsCurrentLine={() => currentLine === lineOffset}
        innerRef={currentLineRef}
      >
        <ComponentEditor
          {...component}
          {...componentDefinition}
          onComponentChange={component => this.handleComponentChange(componentId, component)}
          onComponentKeyDown={onComponentKeyDown}
        />
      </Line>
    )

    // CASE 2: Component is a self closing element
    if (selfClosing) {
      this.handleReportLines(1)
      return componentEditor
    }

    // CASE 3: Component has children
    this.handleReportLines(this.__totalSubTreeLines + 2)
    return (
      <div>
        { componentEditor }
        { this.renderChildren(children) }
        { this.renderCloseTag(component.name) }
      </div>
    )
  }
}
export default SubTreeEditor
