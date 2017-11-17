// @flow
import React from 'react'
import SubTreeEditor from './sub-tree-editor'
import { componentDefinitionMap } from '../defaults'
import { ENTER, ESC, UP, DOWN, cKey } from '../keycodes'
import type { Component, ComponentMap, ComponentDefinitionMap, TagType } from '../types/components'

export default class SourceEditor extends React.Component<{
  componentMap: ComponentMap,
  componentDefinitionMap: ComponentDefinitionMap,
  onComponentChange?: (id: string, component: Component | string) => void,
}, {
  componentMap: ComponentMap,
  currentComponentId: ?string,
  currentTag: ?TagType
}> {
  static defaultProps = {
    componentDefinitionMap
  }

  __computedState = {}

  __resetComponentNavigator () {
    this.__computedState.componentNavigator = {}
  }

  __computeComponentNavigator (componentMap: ComponentMap) {
    this.__resetComponentNavigator()
    this.__recursiveComputeComponentNavigator(componentMap, 'root', {
      parent: null,
      prevSibling: null,
      nextSibling: null
    })
  }

  __recursiveComputeComponentNavigator (
    componentMap: ComponentMap,
    componentId: string,
    config : {
      parent: ?string,
      prevSibling: ?string,
      nextSibling: ?string
    }
  ) {
    const { parent, prevSibling, nextSibling } = config
    const component = componentMap[componentId]
    const children = typeof component === 'string'
      ? []
      : component.children || []

    const firstChild = children[0] || null
    const lastChild = children[children.length - 1] || null

    this.__computedState.componentNavigator[componentId] = {
      parent,
      prevSibling,
      nextSibling,
      firstChild,
      lastChild
    }

    children.forEach((child, i) => {
      const prevSibling = children[i - 1] || null
      const nextSibling = children[i + 1] || null

      this.__recursiveComputeComponentNavigator(componentMap, child, {
        parent: componentId,
        prevSibling,
        nextSibling
      })
    })
  }

  // $FlowFixMe
  constructor (props) {
    super(props)
    this.state = {
      componentMap: props.componentMap,
      currentComponentId: null,
      currentTag: null
    }

    this.__computeComponentNavigator(this.state.componentMap)
  }

  // $FlowFixMe
  componentWillUpdate(nextProps, nextState) {
    const { componentMap } = nextState
    if (this.state.componentMap !== nextState) {
      this.__computeComponentNavigator(componentMap)
    }
  }

  addChild = () => {
    const { componentMap, currentComponentId } = this.state
    if (!currentComponentId) throw new Error('Cannot add child when there is no current component!')

    const component = componentMap[currentComponentId]
    if (typeof component === 'string') return

    const children = component.children

    const defaultComponent = {
      name: 'Text',
      props: [],
      children: []
    }

    const id = Date.now().toString()

    componentMap[id] = defaultComponent
    // $FlowFixMe - we already checked above if this value is a string
    componentMap[currentComponentId].children = children
      ? [...children, id]
      : [ id ]

    this.setState({
      componentMap
    })
  }

  handleLineClick = (componentId: string, tag: TagType) => {
    this.setState({
      currentComponentId: componentId,
      currentTag: tag
    })
  }

  // TODO: can we clean this up?
  goToPrevLine = (componentId: string, tag: TagType) => {
    const { componentMap, componentDefinitionMap } = this.props

    const {
      parent,
      firstChild,
      lastChild,
      prevSibling,
      nextSibling
    } = this.__computedState.componentNavigator[componentId]

    if (tag === 'closing') {
      if (lastChild) {
        const component = componentMap[lastChild]
        const selfClosing = typeof component === 'string'
          || componentDefinitionMap[component.name].selfClosing

        this.setState({
          currentComponentId: lastChild,
          currentTag: selfClosing ? 'self-closing' : 'closing'
        })
      } else {
        this.setState({
          currentTag: 'opening'
        })
      }
    } else {
      if (prevSibling) {
        const component = componentMap[prevSibling]
        const selfClosing = typeof component === 'string'
          || componentDefinitionMap[component.name].selfClosing

        this.setState({
          currentComponentId: prevSibling,
          currentTag: selfClosing ? 'self-closing' : 'closing'
        })
      } else if (parent) {
        this.setState({
          currentComponentId: parent,
          currentTag: 'opening'
        })
      }
    }
  }

  // TODO: can we clean this up?
  goToNextLine = (componentId: string, tag: TagType) => {
    const { componentMap, componentDefinitionMap } = this.props

    const {
      parent,
      firstChild,
      lastChild,
      prevSibling,
      nextSibling
    } = this.__computedState.componentNavigator[componentId]

    if (tag === 'opening') {
      if (firstChild) {
        const component = componentMap[firstChild]
        const selfClosing = typeof component === 'string'
          || componentDefinitionMap[component.name].selfClosing

        this.setState({
          currentComponentId: firstChild,
          currentTag: selfClosing ? 'self-closing' : 'opening'
        })
      } else {
        this.setState({
          currentTag: 'closing'
        })
      }
    } else {
      if (nextSibling) {
        const component = componentMap[nextSibling]
        const selfClosing = typeof component === 'string'
          || componentDefinitionMap[component.name].selfClosing

        this.setState({
          currentComponentId: nextSibling,
          currentTag: selfClosing ? 'self-closing' : 'opening'
        })
      } else if (parent) {
        this.setState({
          currentComponentId: parent,
          currentTag: 'closing'
        })
      }
    }
  }

  handleLineKeyDown = (e: Event) => {
    // HACK - dont do anything if keydown is used inside an autocomplete
    // $FlowFixMe
    const isTargetingAutocomplete = e.target.getAttribute('role') === 'combobox'

    const { currentComponentId, currentTag } = this.state
    if (!currentComponentId || !currentTag) return

    if (e.keyCode === UP) {
      // TODO: get rid of this repetition
      if (isTargetingAutocomplete) {
        e.preventDefault()
        return
      }

      this.goToPrevLine(currentComponentId, currentTag)
    } else if (e.keyCode === DOWN) {
      // TODO: get rid of this repetition
      if (isTargetingAutocomplete) {
        e.preventDefault()
        return
      }

      this.goToNextLine(currentComponentId, currentTag)
    } else if (e.keyCode === cKey) {
      this.addChild()
    }
  }

  handleComponentKeyDown = (e: Event) => {
//    if (e.keyCode === ENTER || e.keyCode === ESC) {
//      this.currentLineElement && this.currentLineElement.focus()
//    }
  }

  render () {
    const {
      componentDefinitionMap,
      onComponentChange
    } = this.props
    const {
      componentMap,
      currentComponentId,
      currentTag
    } = this.state

    console.log(this.__computedState.componentNavigator)

    return (
      <SubTreeEditor
        componentMap={componentMap}
        componentDefinitionMap={componentDefinitionMap}
        currentComponentId={currentComponentId}
        currentTag={currentTag}
        onComponentChange={onComponentChange}
        onLineClick={this.handleLineClick}
        onLineKeyDown={this.handleLineKeyDown}
        onComponentKeyDown={this.handleComponentKeyDown}
      />
    )
  }
}
