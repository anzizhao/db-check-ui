import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'

import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Badge from 'material-ui/Badge/Badge';

import Item from './Item'

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


    render() {
        const { actions, items } = this.props
        const style = this.getStyle() 
        const db = items.toObject()
        return (           
                <div  className="dbList">
                    <List  style={style.list}>
                        { 
                            Object.keys(db).map( (key,index)  => {
                                const item = db[key]
                                return (
                                    <Item 
                                        index={ index }
                                        actions={actions}
                                        key={ key }
                                        item={ item }
                                        tableName={key} 
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
  items: React.PropTypes.instanceOf(Immutable.Map),
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
}
