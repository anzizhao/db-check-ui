import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'

import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Badge from 'material-ui/Badge/Badge';

import Item from './item'

var {exportFile, readFile } = require('../../util')

export default class VList  extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
    }

    getStyle (){
        const style =  this.constructor.style
        //const dStyle = {}
        //return Object.assign({}, style, dStyle) 
        return style 
    } 

    renderBanner (db, style ){
        const viewItemNum = db.size  
        return (
            <div  className="list-banner" >
                <div style={ style.totalInfo } >
                    <span>
                        { `${ viewItemNum }/${this.props.info.number}`}
                    </span>
                </div>

                <div  className="mertic-tips">
                    <span>
                        sql错误=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 8, 8, 1)'}} 
                        />
                        过滤异常=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(13, 163, 230, 1 )'}} 
                        />

                        过滤成功=
                        <Badge
                            badgeContent={''}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(93, 214, 35, 1)'}} 
                            style={ style.badgeContent}
                        />
                    </span>
                    <br/>
                </div>
            </div>
        )
    }


    render() {
        const { actions, items } = this.props
        const style = this.getStyle() 
        //const db = items.toObject()
        return (           
                <div  className="dbList">
                    { this.renderBanner (items, style  ) }
                    <List  style={style.list}>
                        { 
                            items.map((item ,index)  => {
                                return (
                                    <Item 
                                        index={ index }
                                        actions={actions}
                                        key={ index }
                                        item={ item }
                                    />
                                    )
                            })
                        }
                    </List>
                    <Divider inset={true}/>
                </div>
               )
    }
}

VList.propTypes = {
  actions: PropTypes.object.isRequired,
  items: React.PropTypes.instanceOf(Immutable.List),
  info: PropTypes.object.isRequired,
}

VList.style = {
    flatButton: {
        float: "right",
        marginBottom: "10px",
    },
    list: {
        marginBottom: "30px", 
        clear: "both",
        minHeight: '300px',
    },
    badge: {
        marginTop: '22px',
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },
    selectLabel:{
        maxWidth: '250px',
        width: '100px',
        fontSize: 'smaller',
        display: 'inline-block',
    },
    selectBut: {
        marginBottom: '10px',
    },
    totalInfo: {
        float: 'left',
        fontSize: 13,
        margin: '10px',
        marginLeft: '30px',
        fontWeight: 500,
    }
}
