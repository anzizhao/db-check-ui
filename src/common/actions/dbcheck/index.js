var {storeTodoState, storeTodoTags , storeTodoFromfiles}  = require('../../util')


export const INIT_DBCHECK = 'INIT_DBCHECK ' 
export const FILTER_ITEM_TEXT= 'FILTER_ITEM_TEXT' 
export const FILTER_ITEM_DATE = 'FILTER_ITEM_DATE'


export function initDbcheck() {
    const data =  require('json!../../../data/summary.json')
    return { 
        type: INIT_DBCHECK ,
        data
    }
}


