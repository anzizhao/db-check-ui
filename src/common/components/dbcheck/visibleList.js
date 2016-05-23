import {fromJS, Map, List} from 'immutable'
import {sortType, status as itemStatus  } from '../../actions/dbcheck'

// sort rule:   src file ->  complete status -> metric -> tag -> date -> key word 
export default function visibleList (_db, filter) { 
    if(! _db ) {
        return List() 
    }
    //return reports
    let db = filterText( _db, filter.get('text') )
    db = filterStatus (db, filter.get('status')) 
    db = filterSort (db, filter.get('srot'))  // 默认按照表名排序
    return db  
}


function filterStatus (_db, status ) {
    const _status = status.get('type')
    if( _status === itemStatus.all ) {
        return _db 
    }
    return _db.filter ( _item => {
        const filters  = _item.get('filters')
        switch(_status)  {
            case itemStatus.success: 
                // 每一个filter都成功后, 表才测试通过
                return filters.every(item => {
                    return item.queryStatus  && ! item.unusualSample   
                })

            case itemStatus.filterFail: 
                // 没有sql失败, 且有过滤失败
                return filters.every(item => {
                        return  item.queryStatus  
                    }) &&  filters.some (item => {
                            return  item.unusualSample 
                        }) 

            case itemStatus.sqlFail: 
                // 有一个filter sql失败, 表sql 失败
                return filters.some(item => {
                    return ! item.queryStatus  
                })

            default: 
                return false 
        }   
    })
}

function filterSort(_db, sort ) {
    //const type = sort.get('type')
    return _db.sort((f, s) => {
        return f.get('tableName') < s.get('tableName')
    })

    //let sortFunc    
    //switch(sort.get('type'))  {
        //case sortType.table: 
            //return _db.sort((f, s) => {
                //return f.get('tableName') < s.get('tableName')
            //})

        //case sortType.executeAsc: 
            //return _db.sort((f, s) => {
                //return f.sqlExecTime < s.sqlExecTime 
            //})

        //case sortType.executeDesc: 
            //return _db.sort((f, s) => {
                //return f.sqlExecTime > s.sqlExecTime 
            //})


        //default: 
            //return _db 
    //}   
}

function filterText (_db, text ) {
    if( ! text.get('use') ) {
        return _db  
    }

    let reg = new RegExp( text.get('text') )
    return _db.filter ( item  => {
        return reg.test( item.get('tableName') )
    })
}

