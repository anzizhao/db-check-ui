import {checkStatus, parseJson, urlEncode, getCookie}  from '../../util/response'

export const FETCH_CMD = 'FETCH_CMD_TODO'

export const fetchApi = [
    'save',
    'asyncLocal',
    'sendLocalItem',
    'query',
]

export const fetchApiIndex = {}
for(let [key, item]  of fetchApi.entries() ) {
    fetchApiIndex[item] = key 
}

export const NOT_FETCH = 0
export const FETCH_SUCCESS = 1
export const FETCH_FAIL = 2


function makeRequest(cmd, data ) {
    NProgress.start();
    return {
        type: FETCH_CMD,    //FETCH_CMD
        cmd,
        fetchStatus: 'request',  //获取状态
        data
    }
}

const fail = 0
const success = 1

function receiveRequest (cmd, status, data) {
    NProgress.done();
    return {
        type: FETCH_CMD,
        cmd,
        fetchStatus: 'receive',   //获取的状态
        status,   // 接口调用状态 0 fail  1 success     
        data      // if fail, data is error message
    }
}
function _fetch (url, cmdIndex , method='GET', body){
    const cmd = fetchApi[cmdIndex]
    return dispatch => {
            dispatch( makeRequest( cmd, body ) )
            return fetch( url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-csrf-token': getCookie('_csrfToken') 
                },
                credentials: 'same-origin',
                method,
                body: JSON.stringify(body),
            }) 
            .then(checkStatus)
            .then(parseJson)
            .then(resData => {
                dispatch( receiveRequest(cmd, success, resData))
                if( resData.error !== 0 )  {
                    //统一显示错误
                    dispatch ( showErrMsg(resData.msg, resData.error, null, { notSetTimeout: true }  ) )
                } else {
                    // 设置已经同步的标记
                    dispatch( setAsyncTodoFlag() )
                }
            })
            .catch((error) => {  // http 协议层的错误
                receiveRequest(cmd, fail, error)
            })
    }
}


// 保存差异部分
// 视图项差异保存
// 根据async标记得出是否需要同步
export function saveDiff (todos ){
    const url = '/api/v1.0/todos/save'
    const diffItem  = [] 
    todos.forEach((todo) => {
        if( todo.get('async') === false  ) {
            diffItem.push( todo.toJS() )
        }
    })

    return _fetch (url, fetchApiIndex['save'], 'POST', diffItem )
}

// 保存差异部分
// 根据asyncTodos 得出是否需要同步 
export function saveDiffWithAsyncTodos (todos, asyncTodos ){
    //比较asyncTodo 得出需要更新内容 
    const url = '/api/v1.0/todos/save'
    const diffItem  = [] 
    todos.forEach((todo) => {
        const uuid = todo.get('uuid') 
        const result = asyncTodos.find((aTodo)=> {
            return  uuid  ===   aTodo.get('uuid')
        }) 
        if(result) {
            if( todo !== result ) {
                diffItem.push( todo.toJS() )
            }
        } else {
            diffItem.push( todo.toJS() )
        }
    })
    return _fetch (url, fetchApiIndex['save'], 'POST', diffItem )
}



//同步本地的 todos 
function sendLocalItem(newItems, todos ){
    //比较asyncTodo 得出需要更新内容 
    const url = '/api/v1.0/todos/async/localItem'
    const data  = [] 
    for( let item of newItems ) {
        const result = todos.find( todo => todo.get('uuid') === item.uuid )
        if( result ) {
            data.push({ todo: result.toObject(), flag: item.flag } ) 
        }
    }
    return _fetch (url, fetchApiIndex['sendLocalItem'], 'POST', data )
}

//同步本地的 todos 
export function asyncLocal (todos){
    //比较asyncTodo 得出需要更新内容 
    const url = '/api/v1.0/todos/async'
    const data  = [] 
    todos.forEach((todo) => {
        const uuid = todo.get('uuid') 
        const modTime = todo.get('modTime')
        data.push({uuid, modTime})
    })

    return (() => {
        const cmd = 'asyncLocal' 
        const body = data 
        const method = 'POST' 
        return dispatch => {
            dispatch( makeRequest( cmd ) )
            return fetch( url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-csrf-token': getCookie('_csrfToken') 
                },
                credentials: 'same-origin',
                method,
                body: JSON.stringify(body),
            }) 
            .then(checkStatus)
            .then(parseJson)
            .then(resData => {
                dispatch( receiveRequest(cmd, success, resData))
                if( resData.error === 0 )  {
                    //将localNewItem send to server 
                    dispatch( sendLocalItem(resData.data.localItems, todos))
                }
            })
            .catch((error) => {  // http 协议层的错误
                receiveRequest(cmd, fail, error)
            })
        }
    }) ()
}



// query server text   
function _query (type, text ){
    //比较asyncTodo 得出需要更新内容 
    const url = '/api/v1.0/todos/query'
    const data = {
        type ,  
        condition: {
            text  
        }
    }
    return _fetch (url, fetchApiIndex['query'], 'POST', data )
}

function _queryWithoutCond (type, text ){
    //比较asyncTodo 得出需要更新内容 
    const url = '/api/v1.0/todos/query'
    const data = {
        type   
    }
    return _fetch (url, fetchApiIndex['query'], 'POST', data )
}

export function queryText (text ){
    return _query( 'text', text )
}

export function queryFile(text ){
    return _query( 'file', text )
}

export function queryTag(text ){
    return _query( 'tag', text )
}

export function queryComplete(){
    return _queryWithoutCond('complete')
}

export function queryDoing(){
    return _queryWithoutCond('doing')
}


export function queryDate (start, end ){  // start, end 为timestamp
    const url = '/api/v1.0/todos/query'
    const data = {
        type: 'date',  
        condition: {
           startTimestamp: start, 
           endTimestamp: end, 
        }
    }
    return _fetch (url, fetchApiIndex['query'], 'POST', data )
}

//一般查询接口
//options = {
    //content: {
        //type: xxx,
        //text: 'xxx'
    //},
    //date: {
        //startTimestamp: xxxx, 
        //endTimestamp: xxxx,
    //},
    //status, 
//}
export function queryCommon (options){  // start, end 为timestamp
    const url = '/api/v1.0/todos/query'
    let data = {
        type: 'common',  
    }
    data.condition = options 
    return _fetch (url, fetchApiIndex['query'], 'POST', data )
}
