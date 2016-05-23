import { combineReducers } from 'redux'

import Immutable, {fromJS, Map, List} from 'immutable'

import * as actions from '../../actions/dbcheck'
import visibleTodos from '../../components/todo/visibleTodos'

const initState  ={
    db: [], 
    filter: fromJS({
        text: {
            use: false, 
            text: '',
        },
        status: {
            type: actions.status.all,  
        },
        sort: {
            type: actions.sortType.table,
        }
    })
}

function filter ( state = initState.filter , action ) {
    switch( action.type ) {
        case actions.FILTER_ITEM: 
            if( action.data.text && action.data.text !== '' )  {
                state = state.set('text', Map( { use:true, text:action.data.text } )) 
            } else {
                state = state.setIn(['text', 'use'], false ) 
            }            

            state = state.setIn(['status', 'type'], action.data.status )

            state = state.setIn(['sort', 'type'], action.data.sort )
            break 

        default:  
            return state 
    }
    return  state 
}

function db (state = initState.db , action ) {
    switch( action.type ) {
        case actions.INIT_DBCHECK: 
            let arr = []
            for(let tableName in action.data.reports ) {
                let arrItem = {
                    tableName,
                    filters :  action.data.reports[tableName ]  
                }
                arr.push( Map( arrItem ) )
            }
            action.data.reports = List( arr )
            return action.data 
        default:  
    }
    return  state 
}


export default function dbcheck ( state = {}, action) {

    // 级reducers 处理
    const combineState =  {
          db: db (state.db, action ),
          filter: filter(state.filter, action ),
    }
    return combineState 
}









