// @flow
import type { ComponentDefinitionMap } from './types/components'

export const componentDefinitionMap: ComponentDefinitionMap = {
  Text: {
    name: 'Text',
    propDefinitions: [
      {
        name: 'size',
        type: 'enum',
        values: [ 's', 'm', 'l' ],
        defaultValue: 'm',
        required: false
      },
      {
        name: 'weight',
        type: 'enum',
        values: [ 'normal', 'bold', 'bolder' ],
        defaultValue: 'normal',
        required: false
      }
    ],
    selfClosing: false
  },
  Button: {
    name: 'Button',
    propDefinitions: [
      {
        name: 'size',
        type: 'enum',
        values: [ 's', 'm', 'l' ],
        defaultValue: 'm',
        required: false
      }
    ],
    selfClosing: false
  },
  Distribute: {
    name: 'Distribute',
    selfClosing: false
  }
}
