export const SHOW_ERR_MSG = 'SHOW_ERR_MSG';
export const SHOW_ERR_MSG_CB = 'SHOW_ERR_MSG_CB';

export function showErrMsg(msg, error=0, data={}, options={} ) {
  return {
    type: SHOW_ERR_MSG,
    data : {
        msg, 
        error,
        data,
        options
    }
  };
}
/* 
 * options {
        notSetTimeout: true   取消自动隐藏提示 
 
 
 } 
*/
export function showErrMsgOptions(msg, options={}) {
  return {
    type: SHOW_ERR_MSG,
    data : {
        msg, 
        options
    }
  };
}

export function showErrMsgCB(msg, cb=()=>{},  context=this, error=0 , data={}, options={} ) {
  return {
    type: SHOW_ERR_MSG_CB,
    data : {
        msg, 
        cb, 
        context,
        error,
        data,
        options
    }
  };
}

