
import * as  actions   from '../actions/error';
import {fromJS, Map, List} from 'immutable'

const errorInitState = {
        error: 0,
        msg: null,
        cb: null,
        context: null,
        data: {},
        options: {}
} 


export default function error (state = fromJS(errorInitState) , action) {
    let newError 
  switch (action.type) {
      case actions.SHOW_ERR_MSG_CB:
      case actions.SHOW_ERR_MSG:
          newError = {
              ... errorInitState ,
              ... action.data 
          }
          console.dir(newError)
          return fromJS( newError )

      //case actions.SHOW_ERR_MSG_CB:
          //return fromJS({
              //error: action.error || 0,
              //msg: action.msg,
              //cb: action.cb,
              //context: action.context,
              //data: action.data ||  {},
              //options: action.options || errorInitState.options
          //})
      default:
          return state;
  }
}
