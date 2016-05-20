import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import  Immutable from 'immutable'

import ListItem from 'material-ui/List/ListItem';
import Checkbox from 'material-ui/Checkbox';
import SubItem from './SubItem'


export default class Item extends Component {
    constructor(props){
        super(props) 
    }

    shouldComponentUpdate (nProps, nState) {
        if( this.props.item !== nProps.item ) {
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
        let index = 1

        //过程描述
        let subItemViews = subItems.map((item, index ) => {
             
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

    render() {
        const { actions } = this.props
        const style = this.getStyle() 
        const item = this.props.item.toArray()
        //const item = this.props.item.toObject()
        const itemText = this.props.tableName  //表名

        const subItemViews  = this.renderSubItems(item, style )  

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

                    />
                </div>
            </div>
        )
    }

}

Item.propTypes = {
    item: React.PropTypes.instanceOf(Immutable.List),
    actions: PropTypes.object.isRequired,
    tableName: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
}

//static style 
Item.style = {
    listTextSpan: {
        float: 'left',
    },
    selectTag:{
        width: "100%" 
    } 

}
