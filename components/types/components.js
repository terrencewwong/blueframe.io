// @flow

export type PropType = 'boolean' | 'number' | 'string' | 'enum'
export type PropDefinition = {
  name: string,
  type: PropType,
  values? : Array<*>,
  defaultValue?: any,
  required: boolean,
  description?: string
}

export type ComponentDefinition = {
  name: string,
  propDefinitions?: PropDefinition[],
  selfClosing: boolean,
  description?: string
}

export type ComponentDefinitionMap = {
  [name: string]: ComponentDefinition
}

export type Prop = {
  name: string,
  value: any
}

export type ComponentId = string

export type Component = {
  name: string,
  props?: Prop[],
  children?: ComponentId[]
}

export type ComponentMap = {
  [id: string]: Component | string
}

export type TagType = 'opening' | 'closing' | 'self-closing' | 'string'
