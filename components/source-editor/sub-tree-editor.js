// @flow
import React from 'react'
import Monospace from '../monospace'
import Line from '../line'
import TagNameText from '../tag-name-text'
import { componentDefinitionMap } from '../defaults'
import ComponentEditor from '../component-editor'
import StringEditor from '../string-editor'
import type { Component, ComponentMap, ComponentDefinitionMap, TagType } from '../types/components'

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
  currentComponentId: ?string,
  currentTag: ?TagType,
  depth: number,
  lineOffset: number,
  onComponentChange?: (id: string, component: Component | string) => void,
  onComponentKeyDown: (e: Event) => void,
  onLineClick?: (componentId: string, tag: TagType) => void,
  onLineKeyDown?: (e: Event) => void
}>{
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

  handleLineClick = (tag: TagType) => {
    const { onLineClick, componentId } = this.props
    onLineClick && onLineClick(componentId, tag)
  }

  handleLineKeyDown = (e: Event) => {
    const { onLineKeyDown } = this.props
    onLineKeyDown && onLineKeyDown(e)
  }

  renderChildren (children: string[]) {
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
        />
      )
      subTrees.push(subTree)
    }

    return subTrees
  }

  renderCloseTag (name: string) {
    const {
      componentId,
      currentComponentId,
      currentTag,
      depth,
      lineOffset
    } = this.props
    return (
      <Line
        depth={depth}
        isCurrentLine={!!currentComponentId && currentComponentId === componentId && currentTag === 'closing'}
        onClick={() => this.handleLineClick('closing')}
        onKeyDown={this.handleLineKeyDown}
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
      currentComponentId,
      currentTag,
      depth,
      lineOffset,
      onComponentKeyDown
    } = this.props

    const component = componentMap[componentId]

    // CASE 1: component is just a string
    if (typeof component === 'string') {
      return (
        <Line
          depth={depth}
          isCurrentLine={!!currentComponentId && currentComponentId === componentId}
          onClick={() => this.handleLineClick('self-closing')}
          onKeyDown={this.handleLineKeyDown}
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

    const isCurrentLine = selfClosing
      ? !!currentComponentId && currentComponentId === componentId
      : !!currentComponentId && currentComponentId === componentId && currentTag === 'opening'

    const componentEditor = (
      <Line
        depth={depth}
        isCurrentLine={isCurrentLine}
        onClick={() => this.handleLineClick(selfClosing ? 'self-closing' : 'opening')}
        onKeyDown={this.handleLineKeyDown}
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
      return componentEditor
    }

    // CASE 3: Component has children
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
