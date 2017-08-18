import React from 'react'
import SourceCode from '../source-code'
import ComponentEditor from '../component-editor'

export default ({ componentMap, currentComponentId, addComponent, setCurrentComponent }) => {
  const currentComponent = componentMap && componentMap[currentComponentId]
  const componentEditor = currentComponent ? (
    <ComponentEditor component={currentComponent.component} children={currentComponent.children} />
  ) : null

  const sourceCode = componentMap ? (
    <SourceCode
      componentMap={componentMap}
      setCurrentComponent={setCurrentComponent}
    />
  ) : null

  return <div>
    {componentEditor}
    Hello Editor!
    {sourceCode}
  </div>
}
