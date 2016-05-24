import { combineReducers } from 'redux'

import Immutable, {fromJS, Map, List} from 'immutable'

import * as actions from '../../actions/dbcheck'
import * as apiActions from '../../actions/dbcheck/apiActions'

const initState  ={
    db: {}, 
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

function _request(state, action ){
    switch( action.cmd ) {
        case 'fetchCheckinData':
            break
    }
    return state 
}

function _dealInitData( data) {
    let arr = []
    for(let tableName in data.reports ) {
        let arrItem = {
            tableName,
            filters :  data.reports[tableName ]  
        }
        arr.push( Map( arrItem ) )
    }
    data.reports = List( arr )
    return data 
}

function _receive(state, action){
    switch( action.cmd ) {
        case 'fetchCheckinData':
            state = _dealInitData( action.data )
            break
    }
    return state 
}

function db (state = initState.db , action ) {
    switch( action.type ) {
        case actions.INIT_DBCHECK: 
            state = _dealInitData( action.data )
            break
        case apiActions.FETCH_CMD: 
           if( action.fetchStatus === 'request') {
               state = _request(state, action)
           } else if ( action.fetchStatus === 'receive' ) {
                state =  _receive(state, action) 
           }

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









