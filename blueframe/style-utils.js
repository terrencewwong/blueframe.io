import defaults from './defaults'

const spacing = type => ({ theme = {}, [type]: value, top, right, bottom, left }) => {
  if (!value && !top && !right && !bottom && !left) return ''

  const gridSize = theme.gridSize || defaults.gridSize
  const unit = theme.unit || defaults.unit

  if (value) {
    return `${type}: ${value * gridSize}${unit};`
  }

  const values = [ top, right, bottom, left ]
    .map(value => value ? `${value * unit}px` : 0)
    .join(' ')

  return `${type}: ${values};`
}

export const padding = spacing('padding')
export const margin = spacing('margin')
