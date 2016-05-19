import {  setVisibilityFilter, VisibilityFilters } from '../../actions/todo/actions'
import * as todoActions  from '../../actions/todo/actions'
import { eFilename }  from '../../constants'

import {fromJS, Map, List} from 'immutable'

// sort rule:   src file ->  complete status -> metric -> tag -> date -> key word 
export default function selectTodos(state) { 
    let todos = selectFile( state.todos, state.selectFiles) 

    todos = filterItemStatus(todos, state.visibilityFilter)
    todos = filterMertics (todos, state.sort )
    todos = filterTags(todos, state.selectTags)
    todos = filterText (todos, state.filter.get("todoText"))
    todos = filterDate (todos, state.filterDate )
    return todos
   //const  { visibilityFilter, sort, selectFiles, selectTags, filter,filterDate }  = state  
   //return _selectTodos(state.todos, visibilityFilter, sort, selectFiles, selectTags, filter, filterDate)
}


function _selectTodos(_todos, visibilityFilter, sort, selectFiles, selectTags, filter, _filterDate) { 
   let todos = selectFile( _todos, selectFiles) 
       todos = filterItemStatus(todos, visibilityFilter)
       todos = filterMertics (todos, sort )
       todos = filterTags(todos, selectTags)
       todos = filterText (todos, filter.get("todoText"))
       todos = filterDate (todos, _filterDate )
       return todos
}


// src file 
function selectFile (todos, files) {
    //select file 数组为空, 返回为空
    if ( ! files ||  files.size === 0) {
        return List() 
        //return todos 
    } else {
        // 一些特殊的值 全部 没有源文件的
        let tmp 
        tmp = files.find(file => {
            return file.text === eFilename.all 
        }) 
        if ( tmp ) {
            return todos 
        }
        return todos.filter(todo =>{
            let tf = todo.get('fromfile')
            let result = files.find(f =>{
                return tf === f.text 
            })
            return result ? true: false
        })

        //return file.text === fromfile || fromfile === eFilename.browser || fromfile === '' 
    }
}

function filterMertics (todos, cmd) {
    if ( ! cmd || cmd.size === 0 ){
        //默认反向显示
        return todos.reverse()
    }

    let cmds = todoActions.sorts   
    // 生成计算方法 
    let calExpress = (function(sorts) {
        return function (todo){
            return value( sorts[0] )  * 100 + value( sorts[1]) * 10 + value(sorts[2] )
            function value(sort) {
                if ( ! sort ){
                    return 0
                } 
                let mertic = cmds[ sort.cmd ]
                if ( sort.desc ) {
                    return 10 - todo.get( mertic )
                } else {
                    return  todo.get( mertic ) 
                }
            }
        }
    } ) ( cmd.toArray() )
    // a-b > 0 升序  
    return todos.sort((a, b) => calExpress(a) - calExpress(b) )
}


function filterItemStatus (todos, filter) { 
   switch (filter) {
       case VisibilityFilters.SHOW_COMPLETED:
           return   todos.filter(todo => todo.get("completed"))  
       case VisibilityFilters.SHOW_ACTIVE:
           return  todos.filter(todo => !todo.get("completed") ) 

       case VisibilityFilters.SHOW_ALL:
       default:
           return todos
   }
}

function filterTags (todos, selectTags ) {
    if(selectTags.size === 0) {
        return todos 
    }
    return todos.filter(todo =>{
        let result = todo.get("tags").find(tag => {
            let result = selectTags.find( selTag => selTag.text === tag.text ) 
            return result ? true: false 
        })
        return result ? true: false 
    })
}

function filterText (todos, text ) {
    if(!text||  text === '' ) {
        return todos 
    }
    let reg = new RegExp( text )

    return todos.filter(todo => reg.test( todo.get('text') )
    )
}

function filterDate (todos, date ) {
    if( !date ||  ! date.get('isUsed') ) {
        return todos 
    }
    const dataObj = date.toObject()
    //const dayUnit = 24 * 3600 * 1000
    //const st = Math.floor( dataObj.startTimestamp / dayUnit )
    //const et  = Math.floor( dataObj.endTimestamp / dayUnit )
    const st =  dataObj.startTimestamp 
    const et  = dataObj.endTimestamp 
    return todos.filter(todo =>{
        //const t = Math.floor( todo.get('modTime') / dayUnit )
        const t = new Date( todo.get('modTime')   ).getTime()
        return t >= st && t<= et  
    })
}
