import {checkStatus, parseJson, urlEncode, getCookie}  from '../../util/response'
import {showErrMsg} from '../error'
export const FETCH_CMD = 'FETCH_CMD_DBCHECKIN'

export const fetchApi = [
    'fetchCheckinData',
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
    //NProgress.done();
    return {
        type: FETCH_CMD,
        cmd,
        fetchStatus: 'receive',   //获取的状态
        status,   // 接口调用状态 0 fail  1 success     
        data      // if fail, data is error message
    }
}
function _fetch (url, cmd , method='GET', body){
    return dispatch => {
            dispatch( makeRequest( cmd, body ) )
            return fetch( url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                method,
                body: JSON.stringify(body),
            }) 
            .then( data => {
                NProgress.done();
                return data  
            })
            .then(checkStatus)
            .then(parseJson)
            .then(resData => {
                dispatch( receiveRequest(cmd, success, resData))
            })
            .catch((error) => {  // http 协议层的错误
                const msg = 'fetch error' 
                dispatch ( showErrMsg( msg, 0, null, { notSetTimeout: true }  ) )
            })
    }
}

export function fetchUrl (url){
    return _fetch (url, 'fetchCheckinData' )
}









