// @flow
import React from 'react'

const EnumInput = ({
  values,
  ...rest
}: {
  value: *,
  values: ?Array<*>,
  onKeyDown: (e: Event) => void,
  onChange: (value: string) => void
}) => {
  if (!values) throw new Error('prop: `values` must be an array.')

  return (
    <select {...rest}>
      {values.map(v => <option key={v}>{v}</option>)}
    </select>
  )
}
export default EnumInput
