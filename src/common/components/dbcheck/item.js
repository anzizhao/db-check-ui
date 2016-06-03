import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import  Immutable from 'immutable'

import ListItem from 'material-ui/List/ListItem';
import Checkbox from 'material-ui/Checkbox';

import SubItem from './subItem'
import {stateEqual} from '../../util'

import { sqlFailBadge, filterFailBadge, filterSuccessBadge } from './statusBadge'

export default class Item extends Component {
    constructor(props){
        super(props) 
        this.state = {
            renderNest: false, 
        }
    }

    shouldComponentUpdate (nProps, nState) {
        if( this.props.item !== nProps.item 
            || ! stateEqual(nState, this.state ) 
          ) {
            return true 
        }
        return false  
    }

    getStyle (){
        const style =  this.constructor.style
        //const dStyle = {
        //}
        //return Object.assign({}, style, dStyle) 
        return style
    } 

    renderSubItems ( _item, style) {
        const subItems = _item 
        //let index = 1

        //过程描述
        let subItemViews = subItems.get('filters').map((item, index ) => {
             
            return (
                <SubItem 
                    item = { item }
                    key={ index } 
                    index={ index } 
                    actions={this.props.actions} 
                />
            )        
        })
        return subItemViews 
    }
    getItemStatus( item ){
        const hasSqlError = item.get('filters').some( item => {
            return ! item.queryStatus  
        })  
        if( hasSqlError ) {
            return "red" 
        }
        const hasFilterError = item.get('filters').some( item => {
            return  item.queryStatus &&  item.unusualSample   
        })  

        if( hasSqlError ) {
            return   "blue"
        }
        return "green" 

    }
    handleToggleNested = ( listItem ) => {
        if( listItem.state.open ) {
            // to close 
            this.setState({
                renderNest: false  
            })
        } else {
            // to open 
            this.setState({
                renderNest: true  
            })
        }
    };
                            //'background':' linear-gradient(to right, rgb(243, 8, 8), rgb(93, 214, 38) )',
    renderLeftIcon(item, style ) {
        let leftIcons = [
            sqlFailBadge(),
            filterSuccessBadge(),
            filterFailBadge()
        ]
        switch( this.getItemStatus(item) ) {
            case "red":
                return leftIcons[0]
            case "blue": 
                return leftIcons[1]
            case "green":
                return leftIcons[2]
            default: 
                return 
        }
    }

    render() {
        const { actions } = this.props
        const style = this.getStyle() 
        const item = this.props.item
        //const item = this.props.item.toObject()
        const itemText = `${this.props.index+1}. ${this.props.item.get('tableName') }` //表名

        const subItemViews  = this.state.renderNest ? this.renderSubItems(item, style ) : [<span key={1}></span>] 
        const leftIcon  = this.renderLeftIcon( item ,style ) 

        //TODO maybe 如果所有过滤都跑过为绿色(querystatus true && unusualSample false)  不然为 
        // 红色, 蓝色, 或者红+蓝
        return (
            <div className="item">
                <div style={style.listItemDiv }>
                    <ListItem 
                        primaryText={ itemText } 
                        style={style.listItem }
                        primaryTogglesNestedList={true}
                        nestedItems={ subItemViews }
                        leftIcon ={ leftIcon }
                        key={this.props.index}
                        onNestedListToggle={this.handleToggleNested}
                    />
                </div>
            </div>
        )
    }

}

Item.propTypes = {
    item: React.PropTypes.instanceOf(Immutable.Map ),
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

//static style 
Item.style = {
    listTextSpan: {
        float: 'left',
    },
    badge: {
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },
}
