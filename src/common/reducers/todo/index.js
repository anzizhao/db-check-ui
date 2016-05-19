import { combineReducers } from 'redux'

import Immutable, {fromJS, Map, List} from 'immutable'

import { SET_VISIBILITY_FILTER, VisibilityFilters, EXPORT_TODO, INIT_TODO } from '../../actions/todo/actions'

import * as todoActions  from '../../actions/todo/actions'
import visibleTodos from '../../components/todo/visibleTodos'

import { eFilename }  from '../../constants'
import { todos }  from './todos'

import * as todoApiActions from '../../actions/todo/apiActions'

var {
    storeTodoState, 
    storeTodoTags, 
    storeTodoFromfiles,
    storeTodoSelectFiles, 
    storeTodoSelectTags,
    exportFile 
} = require('../../util')
var uuid = require('uuid');
const { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } = VisibilityFilters
const { SORT_ORIGIN } = todoActions.sorts 

const initState  ={
    visibilityFilter:  SHOW_ACTIVE,
    sort: List(),
    mode: todoActions.todoMode.default,
    tags: List(),
    selectTags: List(),
    selectFiles: List(),
    fromfiles : List([
        { id:0 , text: eFilename.all },
        { id:1 , text: ''}, // 存放浏览器的项
    ]),
    filter: Map(),
    filterDate: Map({ isUsed: false }),  //过滤日期
    status: Map({                 //todos 的状态 
        init: false, 
    }),
}
function visibilityFilter(state = initState.visibilityFilter , action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}
function sort (state =  initState.sort, action) {
    let cmds = todoActions
    let result  
    switch (action.type) {
        case cmds.ADD_SORT:
            state = state.map((sort,index)  => {
                if ( sort.cmd === action.cmd )  {
                    result = true 
                    sort.desc = action.desc ?  true: false
                }
                return sort 
            })
            return result ? state : state.push( {cmd:action.cmd, desc:action.desc ? true: false} )

        case cmds.DEL_SORT:
            return state.filter ( sort => sort.cmd != action.cmd ) 

        default:
            return state
    }
}
function mode (state = initState.mode , action) {
    let cmds  = todoActions
    switch (action.type) {
        case cmds.SET_MODE:
            return action.mode  
        case cmds.TOGGLE_MODE:
            if( action.mode === cmds.todoMode.select && state !==  cmds.todoMode.select ) {
                //关注的selectmode 且原来的不是select mode， 改为select mode
                return  todoActions.todoMode.select 
            }
            return todoActions.todoMode.default
        default:
            return state
    }
}

function addTagsItem(state, item ){
    //array find not found return undefine 
    let index = state.find((ele, index, arr) => {
        return ele.text === item.text
    })

    if ( ! index ) {
        let newItem = {
            id: item.text,
            text: item.text 
        }
        return state.push(newItem)
    } 
    return state 
}

function tags (state = initState.tags, action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_TAGS:
            return List( storeTodoTags() ) 

        case cmds.ADD_TAGS:
            if ( action.tags ) {
                // add array 
                for(let item of action.tags )  {
                    state = addTagsItem(state, { text: item.text })
                }
            } else {
                // add item 
                state = addTagsItem(state,{text: action.text} )
            
            }
            break 

        default:
            return state
    }

    //store tags
    storeTodoTags(state.toArray() );
    return state 
}

function selectTags (state = initState.selectTags , action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_TAGS:
            return List( storeTodoSelectTags() ) 

        case cmds.CLEAR_ALL_TODO:
            storeTodoSelectTags([])
            return List()

        case cmds.ADD_FILTER_TAGS:
            index =  state.findIndex(tag => tag.text  === action.tag.text )
            if ( index !== -1 ) {
                return state 
            }
            state = state.push( action.tag )
            storeTodoSelectTags( state.toArray() )  
            return state 

        case cmds.DEL_FILTER_TAGS:
            index =  state.findIndex(tag => tag.text  === action.tag.text )
            if ( index === -1 ) {
                return state 
            }
            state = state.delete(index)
            storeTodoSelectTags( state.toArray() )  
            return state 

        case cmds.CHANGE_FILTER_TAGS:
            state = List( action.tags )
            storeTodoSelectTags( state.toArray() )  
            return state 

        default:
            return state
    }
}

function fromfiles (state = initState.fromfiles, action) {
    let cmds = todoActions
    let newItem, index , db
    //需要保存的  break, 不然在case语句里面返回
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_FROMFILES:
            db = storeTodoFromfiles()
            if( db && db[0] &&  db[0].text === eFilename.all ) {
                return List(
                    [
                        ... db
                    ]
                ) 
            } else {
                return List(
                    [
                        ... state, 
                        ... db
                    ]
                ) 
            }
                    //... fromfilesInitState.toArray()
        case cmds.CLEAR_ALL_TODO:
            state = initState.fromfiles
            break

        case cmds.ADD_FROMFILE:
            index = state.find(f => {
                return f.text === action.fromfile.text  
            })
            if ( index ) {
                // found, has in 
                return state  
            }
            state = state.push({id: state.size, text: action.fromfile.text })
            break

        default:
            return state
    }

    storeTodoFromfiles(state)
    return state 
}

function selectFiles(state = initState.selectFiles, action) {
    let cmds = todoActions
    let newItem, index 
    switch (action.type) {
        case todoActions.INIT_ALL:
        case cmds.INIT_FROMFILES:
            let db = storeTodoSelectFiles()
            if ( !db || db.length === 0 ) {
                db = [{id:0, text: eFilename.all }] 
            }
            return List( db ) 

        case cmds.SET_SELECT_FILE:
            return List( action.files )

        case cmds.CLEAR_ALL_TODO:
            storeTodoSelectFiles([])
            return List()

        case cmds.ADD_SELECT_FILE:
            index =  state.findIndex(file => file.text === action.file.text )
            if ( index !== -1 ) {
                return state 
            }
            return state.push({id: state.size, text: action.file.text } )

        case cmds.DEL_SELECT_FILE:
            index =  state.findIndex(file => file.text === action.file.text )
            if ( index === -1 ) {
                return state 
            }
            return state.delete(index)

        default:
            return state
    }
}

function filter (state = initState.filter , action) {
    let cmds = todoActions
    // not to  store 
    switch (action.type) {
        case cmds.FILTER_ITEM_TEXT:
            state = state.set('todoText', action.text )
            break
        default:
            return state
    }
    return state 
    // to store 
}

function filterDate  (state = initState.filterDate , action) {
    let cmds = todoActions
    // not to  store 
    switch (action.type) {
        case cmds.FILTER_ITEM_DATE:
            if( action.isUsed ) {
                state = Map({
                    isUsed: action.isUsed, 
                    startTimestamp: action.startTimestamp,
                    endTimestamp: action.endTimestamp,
                }) 
            } else {
                state = Map({
                    isUsed: action.isUsed, 
                }) 
            }
            break
        default:
            return state
    }
    return state 
    // to store 
}

function status (state = initState.status , action) {
    let cmds = todoActions
    switch (action.type) {
        case cmds.INIT_ALL:
            state = state.set('init', true)
            break
        default:
            return state
    }
    return state 
}


// state 不做修改
function beforeReducers(state, action){
    action.currentMode = mode(state.mode, action) 

    let tmp , t 
    switch ( action.type ) {
        case todoActions.IMPORT_TODO:
            action.todos = action.fileJson.todos || []
            action.tags = action.fileJson.tags || []
            break

        case todoActions.DEL_SELECT:
        case todoActions.DEL_PAGE:
            //t  = state
            //action.visibilityFilter = t.visibilityFilter
            //action.sort = t.sort 
            //action.selectFiles = t.selectFiles
            //action.selectTags = t.selectTags
            //action.filter = t.filter
            //action.filterDate = t.filterDate
            action.todos = visibleTodos (state) 
            break
        case todoActions.ADD_TODO:
            t  = state
            action.fromfile = '' 

            tmp = t.selectFiles.find( file => {
                return file.text === eFilename.all ||  file.text === '' 
            }) 
            if ( tmp ) {
                action.fromfile = '' 
            } else {
                tmp = t.fromfiles.find( file => {
                    return t.selectFiles.some( sfi => sfi.text === file.text ) 
                })
                if ( tmp ) {
                    action.fromfile = tmp.text  
                }
            }
            //let files = t.selectFiles
            //if( files.length && files[0].text  !== '[全部文件]' 
                    //&& files[0].text  !== '[全部文件]' 
              //) {
                //action.fromfile = t.selectFile[0].text
            //}
            break

    }
    return action
}

function objExportFile(obj, filename) {
    const jsonFile = JSON.stringify( obj )
    exportFile(jsonFile, filename);
}

function _initFilterState(state ) {
    state.sort = initState.sort 
    state.visibilityFilter = initState.visibilityFilter 
    state.selectTags = initState.selectTags
    state.filter = initState.filter  
    state.filterDate  = initState.filterDate  
    state.selectFiles = initState.selectFiles.push( {id:0, text: eFilename.all })
    return state 
}



function _requestQueryType( state, _action ,type ) {
    const action = _action.data.condition
    let tmp 
    // 根据具体的项 设置
    switch ( type ) {
        case 'text' : 
            state.filter  = state.filter.set('todoText', action.text )
            break
            //这是正则的 
            //允许selectTags 比tags多   这可能会引发其他的bug
            // 暂时 tag 和 file 不考虑 
        //case 'tag': 
            //tmp =  state.selectTags.findIndex(tag => tag.text  === action.text )
            //if ( tmp === -1 ) {
                //state.selectTags = state.selectTags.push( {id: action.text, text: action.text  }) 
            //}
            //break
        //case 'file': 
            //tmp =  state.selectFiles.findIndex(file => file.text === action.text )
            //if ( tmp === -1 ) {
                //return state.selectFiles.push({id: state.size, text: action.text } )
            //}
            //break
        case 'date': 
            state.filterDate = Map({
                    isUsed: true, 
                    startTimestamp: action.startTimestamp,
                    endTimestamp: action.endTimestamp,
                }) 
        case 'common': 
            state.visibilityFilter  = action.status
            if( action.date ) {
                state.filterDate = Map({
                    isUsed: true, 
                    startTimestamp: action.date.startTimestamp,
                    endTimestamp: action.date.endTimestamp,
                }) 
            }
            if( action.content ) {
                //应该type为  text  tag   file
                action.text = action.content.text 
                state = _requestQueryType(state, _action, action.content.type ) 
            }
            break
        //case 'complete': 
            //state.visibilityFilter =  SHOW_COMPLETED
            //break
        //case 'doing': 
            //state.visibilityFilter =  SHOW_ACTIVE
            //break


    }
    return state 
}


function _request(state, action ){
    //state = state.updateIn(['fetchedStatus', action.cmd ], ()=>actions.NOT_FETCH )
    //return state.updateIn(['isFetchingApi', action.cmd ], ()=>true )
    
    const api =  action.cmd
    const apiIndex = todoApiActions.fetchApiIndex
    switch( apiIndex[action.cmd]) {
        case apiIndex['query']:
            // 清除过滤条件
            state = _initFilterState( state )
            state = _requestQueryType( state, action, action.data.type )
            break
    }
    return state 
}

function _receive(state, action){
    const oriTodos = state.todos
    const api =  action.cmd
    //每个命令特殊部分
    const apiIndex = todoApiActions.fetchApiIndex
    let data  
    switch( apiIndex[action.cmd]) {
       case apiIndex['save']:
           if( action.status ) {
               //同步成功后, async标记,和asyncTodo设置  
               state.todos = state.todos.map(todo => {
                   return todo.set('async', true) 
               })
               state.asyncTodos = state.todos
               //state.asyncTodos = state.todos.map(todo => todo )
           } 
           break 

       case apiIndex['asyncLocal']:
           if( action.status && action.data.error === 0 ) {
               //更新本地的项
               data = action.data.data 
               const serverItems = data.serverItems
               if(serverItems && serverItems.length ){
                   state.todos = state.todos.map(todo => {
                       const result = serverItems.find(sTodo => 
                           sTodo.uuid === todo.get('uuid') 
                       ) 
                       return ! result ? todo:  Map({ ...todo.toObject(), ...result, collapse: true, 'async': true })  // 最后一部分为兼容
                   }) 

               } 

               state.asyncTodos = state.todos
               //同步成功后, async标记,和asyncTodo设置  
           } 
           break 
       case apiIndex['sendLocalItem']:
           if( action.status && action.data.error === 0 ) {
               //更新成功 
               //state.asyncTodos = state.todos
               return state
           } 
           break 

       case apiIndex['query']:
           if( action.status && action.data.error === 0 ) {
               //更新本地的项
               const items = action.data.data 
               for(let item of items ){
                   const index = state.todos.findIndex( todo => item.uuid === todo.get('uuid') ) 
                   if ( index !== -1) {
                       //更新本地的
                       const result = state.todos.get(index)
                       const localModTime = new Date( result.get('modTime') ).getTime() 
                       const itemModTime = new Date( item.modTime ).getTime()

                       //如果服务器端内容是旧不更新,为新的才更新
                       if( localModTime < itemModTime  ) {
                           state.todos =  state.todos.update(index, todo => {
                               return  Map( {...todo.toObject(), ...item, collapse: true, 'async': true })  
                           })
                       }
                   } else {
                       //添加新项内容
                       state.todos =  state.todos.push( Map({ ...item, collapse: true, 'async': true }) ) 
                   }
               }
               state.asyncTodos = state.todos
               //同步成功后, async标记,和asyncTodo设置  
           } 
           break 
    }

    if( oriTodos !== state.todos ) {
        storeTodoState( state.todos.toJS() );
        // 添加tags, 遍历todos, 添加tags 
        state.todos.forEach( todo => {
            const tags = todo.get('tags') 
            if( ! tags || tags.length === 0 ){
                return  
            }
            tags.forEach(tag => {
                state.tags = addTagsItem( state.tags, { text: tag.text })
            })
        })
        storeTodoTags ( state.tags.toArray() )
    }
    return state 
}




function afterReducers ( state={} ,  action ) {
    let jsonObj , filename  
    let exportSelect 

    //如果todos修改, 通过比较每一项的todo 更新aysnc标记
    //state.todos = compareSetAsyncSign(state.todos, state.asyncTodos)

    //下面的命令多了 可以分函数分层处理
    switch (action.type) {
        case todoActions.EXPORT_TODO:
            jsonObj = {
                //todos: state.todos.present.toObject(),
                todos: state.todos.map(todo=> todo.toObject() ).toArray(),
                tags: state.tags 
            }
            filename = `todo_${ new Date().toLocaleDateString() }.json`
            objExportFile(jsonObj, filename )

            return state

        case todoActions.IMPORT_TODO: // 
            // 添加fromfile 项 和selectFromfile 项
            let result = state.fromfiles.find(item => {
                return item.text === action.fromfile 
            })
            if (! result ) {
                let id = state.fromfiles.size
                state.fromfiles = state.fromfiles.push({ id,    text: action.fromfile})
                storeTodoFromfiles( state.fromfiles.toArray() )
            } 
            result =  state.selectFiles.find( file => file.text === action.fromfile )
            if ( ! result ) {
                state.selectFiles = state.selectFiles.push({id: state.selectFiles.size, text: action.fromfile } )
                storeTodoSelectFiles ( state.selectFiles.toArray() )
            }

            // 添加tags, 遍历todos, 添加tags 
            state.todos.forEach( todo => {
                const tags = todo.get('tags') 
                if( ! tags || tags.length === 0 ){
                    return  
                }
                tags.forEach(tag => {
                    state.tags = addTagsItem( state.tags, { text: tag.text })
                })
            })
            storeTodoTags ( state.tags.toArray() )

            return state

        case todoActions.EXPORT_SELECT:
            exportSelect = true

        case todoActions.EXPORT_PAGE:
            let t  = state
            jsonObj = {
                tags: state.tags ,
            }
            //jsonObj.todos = visibleTodos (t.todos.present, t.visibilityFilter, t.sort, t.selectFiles )
            jsonObj.todos = visibleTodos (t)
            if ( exportSelect  ) {
                jsonObj.todos = jsonObj.todos.filter(item => item.get("select") )
            }
            jsonObj.todos = jsonObj.todos.map(todo => todo.toObject())
                                          .toArray()

            filename = `todo_${ new Date().toLocaleDateString() }.json`
            //if( state.selectFiles.size !==  0 ) {
                //filename = state.selectFiles.get(0).text  
            //} else {
                //filename = `todo_${ new Date().toLocaleDateString() }.json`
            //}

            objExportFile(jsonObj, filename )
            return state

      case todoActions.DEL_SELECT: 
      case todoActions.DEL_PAGE: 
          // 更新fromfiles 和 selectfiles
           state.fromfiles = state.fromfiles.filter( (f,index)  => 
                index < 2 || state.todos.some ( todo => todo.get("fromfile") === f.text ) 
          )
           state.selectFiles =  state.selectFiles.filter(sf =>  {
                let result = state.fromfiles.find( f => f.text === sf.text ) 
                return result ? true: false
           })
           return state  

       case todoApiActions.FETCH_CMD:
           if( action.fetchStatus === 'request') {
               return _request(state, action)
           } else if ( action.fetchStatus === 'receive' ) {
                return _receive(state, action) 
           }


       case todoActions.INIT_FILTER_STATE:
            state = _initFilterState( state )
            break
    }
    return state 
}
//需要在todoApp 这里完成完成导入导出  因为处理完的tags 和 todos 
export default function todoApp(state = {}, action) {
    const actionb = beforeReducers(state,  action) 
    //const undoTodo = undoable(todos, { filter: distinctState() })

    // 级reducers 处理
    const combineState =  {
          tags: tags(state.tags, actionb ),
          selectTags: selectTags(state.selectTags, actionb ),
          fromfiles: fromfiles(  state.fromfiles, actionb ),
          visibilityFilter: visibilityFilter(state.visibilityFilter, actionb),
          sort: sort(state.sort, actionb ),
          selectFiles: selectFiles(state.selectFiles, actionb ),
          mode: actionb.currentMode ,   // mode 需要优先处理， 其他需要根据mode来作处理的
          todos:  todos( state.todos, actionb ),
          asyncTodos: state.asyncTodos || List(),   //同步服务器记录
          filter: filter(state.filter, actionb ),
          filterDate: filterDate(state.filterDate, actionb ),
          status: status(state.status, actionb), 
    }

    // 本级reducers处理 
    const retState = afterReducers(combineState, actionb )

    return retState 
}

