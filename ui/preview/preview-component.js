import React from 'react'
const Atoms = require('../../blueframe/atoms')

export default ({ component }) => {
  const { displayName, props } = component
  const Component = Atoms[displayName]
  return (
    <div>
      <Component {...props} />
    </div>
  )
}
