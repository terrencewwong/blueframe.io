// @flow
import React, { Children } from 'react'
// import type { ComponentId, ComponentMap, ComponentDefinitionMap } from '../components/types'
// import SourceEditor from '../components/source-editor'

const componentDefinitionMap = {
  Distribute: {
    name: 'Distribute',
    props: [
      {
        name: 'vertical',
        type: 'boolean',
        required: false
      }
    ],
    selfClosing: false
  },

  Text: {
    name: 'Text',
    props: [
      {
        name: 'size',
        type: 'string',
        required: false
      }
    ],
    selfClosing: false
  },

  Input: {
    name: 'Input',
    props: [],
    selfClosing: true
  }
}

//const componentMap: ComponentMap = {
//  root: {
//    name: 'Distribute',
//    attributes: [{ name: 'vertical', value: true }],
//    children: ['1']
//  },
//  '1': {
//    name: 'Text',
//    attributes: [
//      {
//        name: 'size',
//        value: 'size1'
//      }
//    ],
//    children: ['2']
//  },
//  '2': 'yolo'
//}

//export default () => (
//  <div>
//    <div>
//      <div>Editor</div>
//      <div>
//        <SourceEditor componentMap={componentMap} componentDefinitionMap={componentDefinitionMap} />
//      </div>
//    </div>
//    <div>
//      <div>Preview</div>
//    </div>
//  </div>
//)
