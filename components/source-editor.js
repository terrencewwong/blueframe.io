// @flow
import React from 'react'
import Monospace from './monospace'
import Line from './line'
import TagNameText from './tag-name-text'
import { componentDefinitionMap } from './defaults'
import ComponentEditor from './component-editor'
import StringEditor from './string-editor'
import type { Component, ComponentMap, ComponentDefinitionMap } from './types/components'

const ClosingTag = ({ name }) => (
  <Monospace>
    {'</'}
    <TagNameText>{name}</TagNameText>
    {'>'}
  </Monospace>
)

class SourceEditor extends React.Component<{
  componentId: string,
  componentMap: ComponentMap,
  componentDefinitionMap: ComponentDefinitionMap,
  depth: number,
  onComponentChange?: (id: string, component: Component | string) => void
}>{
  static defaultProps = {
    componentId: 'root',
    componentDefinitionMap,
    depth: 0
  }

  handleComponentChange = (componentId: string, component: Component | string) => {
    const { onComponentChange } = this.props
    onComponentChange && onComponentChange(componentId, component)
  }

  renderChildren (children: string[]) {
    const { depth, ...rest } = this.props
    return children.map(child =>
      <SourceEditor
        {...rest}
        componentId={child}
        depth={depth + 1}
      />
    )
  }

  render () {
    const {
      componentId,
      componentMap,
      componentDefinitionMap,
      depth
    } = this.props

    const component = componentMap[componentId]

    if (typeof component === 'string') {
      return (
        <Line depth={depth}>
          <StringEditor
            value={component}
            onValueChange={component => this.handleComponentChange(componentId, component)}
          />
        </Line>
      )
    }

    const componentDefinition = componentDefinitionMap[component.name]
    const { selfClosing } = componentDefinition
    const { children } = component

    if (selfClosing && children && children.length) {
      throw new Error('selfClosing elements cannot have children.')
    }

    return (
      <div>
        <Line depth={depth}>
          <ComponentEditor
            {...component}
            {...componentDefinition}
            onComponentChange={component => this.handleComponentChange(componentId, component)}
          />
        </Line>
        {children ? this.renderChildren(children) : null}
        {!selfClosing ? (
          <Line depth={depth}>
            <ClosingTag name={component.name} />
          </Line>
        ) : null}
      </div>
    )
  }
}
export default SourceEditor
