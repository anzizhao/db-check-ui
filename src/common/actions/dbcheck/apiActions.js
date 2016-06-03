import createFetch from '../../util/fetch'

export const FETCH_CMD = 'FETCH_CMD_DBCHECKIN'
export const fetchApi = [
    'fetchCheckinData',
]
const fetchObj = createFetch( FETCH_CMD  )

export function fetchUrl (url){
    return fetchObj._fetch (url, 'fetchCheckinData' )
}









