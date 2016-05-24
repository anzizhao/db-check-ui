var {storeTodoState, storeTodoTags , storeTodoFromfiles}  = require('../../util')

export { fetchUrl } from './apiActions'

export const INIT_DBCHECK = 'INIT_DBCHECK ' 
export const FILTER_ITEM = 'FILTER_ITEM' 
export const FILTER_ITEM_TEXT= 'FILTER_ITEM_TEXT' 
export const FILTER_ITEM_DATE = 'FILTER_ITEM_DATE'

export const sortType = {
    table: "table",    
    executeAsc: 'executeAsc',
    executeDesc: 'executeDesc'
} 

export const status = {
    all: "all",    
    success: "success",    
    filterFail: 'filterFail',
    sqlFail: 'sqlFail'
} 

export function initDbcheck() {
    const data =  require('json!../../../data/summary.json')
    return { 
        type: INIT_DBCHECK ,
        data
    }
}

export function toFilter(opt) {
    return { 
        type: FILTER_ITEM,
        data: opt
    }
}


