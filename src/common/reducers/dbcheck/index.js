import { combineReducers } from 'redux'

import Immutable, {fromJS, Map, List} from 'immutable'

import * as actions from '../../actions/dbcheck'
import visibleTodos from '../../components/todo/visibleTodos'

const initState  ={
    db: [], 
    fileterText: {
        use: false, 
        text: '',
    },
    filterStatus: {
        use: false, 
        status: 0,  
    }
}

function filterText ( state = initState.fileterText , action ) {
    switch( action.type ) {
        default:  
    }
    return  state 
}
function filterStatus (state = initState.filterStatus, action ) {
    switch( action.type ) {
        default:  
    }
    return  state 
}

function db (state = initState.db , action ) {
    switch( action.type ) {
        case actions.INIT_DBCHECK: 

            Object.keys( action.data.reports ).forEach( key => {
                action.data.reports[key]  = List( action.data.reports[key] )
            })
            action.data.reports = Map ( action.data.reports )
            return action.data 
        default:  
    }
    return  state 
}


export default function dbcheck ( state = {}, action) {

    // 级reducers 处理
    const combineState =  {
          db: db (state.db, action ),
          filterText: filterText (state.filterText, action ),
          filterStatus: filterStatus (state.filterStatus, action), 
    }
    return combineState 
}









