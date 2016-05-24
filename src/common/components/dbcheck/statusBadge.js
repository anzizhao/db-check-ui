import React  from 'react'
import Badge from 'material-ui/Badge/Badge';

const style = {
    badge: {
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },
}

export function sqlFailBadge (){
    return (
        <Badge
            badgeContent={''}
            style={ style.badgeContent}
            badgeStyle={ { ...style.badge, 'backgroundColor':'rgb(243, 8, 8)'}}
        />
    )
}

export function filterSuccessBadge (){
    return (
        <Badge
            badgeContent={''}
            style={ style.badgeContent}
            badgeStyle={{...style.badge, 'backgroundColor':'rgb(93, 214, 35)'}} 
        />
    )
}

export function filterFailBadge (){
    return (
        <Badge
            badgeContent={''}
            style={ style.badgeContent}
            badgeStyle={{...style.badge, 'backgroundColor':'rgb(13, 163, 230)'}} 
        />
    )
}
