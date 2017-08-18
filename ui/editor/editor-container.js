import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addComponent, setCurrentComponent } from '../../store'
import EditorComponent from './editor-component'

const mapStateToProps = state => {
  const { componentMap, currentComponentId } = state
  return {
    componentMap,
    currentComponentId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addComponent: bindActionCreators(addComponent, dispatch),
    setCurrentComponent: bindActionCreators(setCurrentComponent, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorComponent)
