
import {checkStatus, parseJson, urlEncode, getCookie}  from './response'
import {showErrMsg} from '../actions/error'

// api接口状态 没有使用
//export const NOT_FETCH = 0
//export const FETCH_SUCCESS = 1
//export const FETCH_FAIL = 2



//网络返回状态
const fail = 0
const success = 1

export default function createFetch ( FETCH_CMD ) {
    const retObj = {}
    retObj.makeRequest  =   function (cmd, data ) {
        NProgress.start();
        return {
            type: FETCH_CMD,    //FETCH_CMD
            cmd,
            fetchStatus: 'request',  //获取状态
            data
        }
    }

    retObj.receiveRequest  = function (cmd, status, data) {
        return {
            type: FETCH_CMD,
            cmd,
            fetchStatus: 'receive',   //获取的状态
            status,   // 接口调用状态 0 fail  1 success     
            data      // if fail, data is error message
        }
    }

    retObj._fetch =  function (url, cmd , method='GET', body, dealReturnDataCB ){
        return dispatch => {
            dispatch( retObj.makeRequest( cmd, body ) )
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
                dispatch( retObj.receiveRequest(cmd, success, resData))

                // 自己的接口的  处理错误
                //if( resData.error !== 0 )  {
                    //dispatch ( showErrMsg(resData.msg, resData.error, null, { notSetTimeout: true }  ) )
                //} 
                //处理具体事项
                if( typeof dealReturnDataCB  === 'function' ) {
                    dealReturnDataCB () 
                }
            })
            .catch((error) => {  // http 协议层的错误
                const msg = 'fetch error' 
                dispatch ( showErrMsg( msg, 0, null, { notSetTimeout: true }  ) )
                dispatch( retObj.receiveRequest(cmd, fail ))
            })
        }
    }

    return retObj 
}



