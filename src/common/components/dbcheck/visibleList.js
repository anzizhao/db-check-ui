import {fromJS, Map, List} from 'immutable'

// sort rule:   src file ->  complete status -> metric -> tag -> date -> key word 
export default function visibleList (state /* dbcheck */) { 
    //return reports
    const items = state.reports || Map()
    return  items  
}


function filterStatus (items, text ) {
    if(!text||  text === '' ) {
        return todos 
    }
    let reg = new RegExp( text )
    return todos.filter(todo => reg.test( todo.get('text') )
    )
}

function filterText (todos, text ) {
    if(!text||  text === '' ) {
        return todos 
    }
    let reg = new RegExp( text )

    return todos.filter(todo => reg.test( todo.get('text') )
    )
}

