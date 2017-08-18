import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const exampleInitialState = {
  componentMap: {
    root: {
      component: 'Text',
      children: 'yolo'
    }
  },
  currentComponentId: null
}

export const actionTypes = {
  ADD_COMPONENT: 'ADD_COMPONENT',
  SET_CURRENT_COMPONENT: 'SET_CURRENT_COMPONENT'
}

export const reducer = (state = exampleInitialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_COMPONENT:
      const id = state.componentMap ? 'randomId' : 'root'
      const componentMap = {
        ...(state.componentMap || {}),
        [id]: action.payload
      }

      return {
        ...state,
        componentMap,
        currentComponentId: id
      }

    case actionTypes.SET_CURRENT_COMPONENT:
      return {
        ...state,
        currentComponentId: action.payload.id
      }

    default: return state
  }
}

export const addComponent = ({ component, children }) => dispatch => {
  return dispatch({
    type: actionTypes.ADD_COMPONENT,
    payload: {
      component,
      children
    }
  })
}

export const setCurrentComponent = id => dispatch => {
  return dispatch({
    type: actionTypes.SET_CURRENT_COMPONENT,
    payload: {
      id
    }
  })
}

export const initStore = (initialState = exampleInitialState) => {
  return createStore(reducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)))
}
