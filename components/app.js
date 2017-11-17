// @flow
import React from 'react'
import styled from 'styled-components'
import safeEval from 'notevil'
import SourceEditor from './source-editor'
import ComponentEditor from './component-editor'
import Text from './design-system/text'
import Button from './design-system/button'
import type { Component, ComponentMap } from './types/components'
import type { LineInfo } from './source-editor'
const Babel = require('@babel/standalone')

const stringifyLine = ({ id, tag }: LineInfo, componentMap: ComponentMap) => {
  const component = componentMap[id]
  if (typeof component === 'string') return component

  const { name } = component
  if (tag === 'closing') return `</${name}>`

  const { props = [] } = component
  const stringifiedProps = props
    .map(({ name, value }) => `${name}={${JSON.stringify(value)}}`)
    .join(' ')

  // TODO: handle self closing tags
  return `<${name} ${stringifiedProps}>`
}

export default class App extends React.Component<{
  componentMap: ComponentMap,
  lines: LineInfo[]
}, {
  componentMap: ComponentMap,
  lines: LineInfo[]
}> {
  // $FlowFixMe
  constructor (props) {
    super(props)
    this.state = {
      componentMap: props.componentMap,
      lines: props.lines
    }
  }

  computedState = {}

  // $FlowFixMe
  componentWillUpdate (nextProps, nextState) {
    const { componentMap, lines } = nextState
    const jsx = lines
      .map(line => stringifyLine(line, componentMap))
      .join('')

    try {
      const { code } = Babel.transform(jsx, {
        presets: ['es2015', 'react']
      })

      try {
        const preview = safeEval(code, {
          React,
          Text,
          Button
        })

        this.computedState.preview = preview
      } catch (e) {
        console.log(e)
        // Also do nothing lol
      }

    } catch (e) {
      console.log(e)
      // Do nothing
    }

  }

  // $FlowFixMe
  handleComponentChange = (id, component) => {
    const { componentMap } = this.state
    componentMap[id] = component
    this.setState({ componentMap })
  }

  handleLinesChange = (lines: LineInfo[]) => {
    this.setState({ lines })
  }

  render () {
    const { componentMap, lines } = this.state
    const { preview } = this.computedState

    return (
      <div>
        <h2>Editor</h2>
        <SourceEditor
          componentMap={componentMap}
          lines={lines}
          onComponentChange={this.handleComponentChange}
          onLinesChange={this.handleLinesChange}
        />
        <h2>Preview</h2>
        {preview}
      </div>
    )
  }
}
