import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/List/ListItem';
import Badge from 'material-ui/Badge/Badge';

import  Immutable from 'immutable'
import Sample from './sample'
import { sqlFailBadge, filterFailBadge, filterSuccessBadge } from './statusBadge'

export default class SubItem extends Component {
    constructor(props){
        super(props) 
    }
    //componentDidMount () {
    //}
    //shouldComponentUpdate (nProps, nState) {
    //}
    //componentDidUpdate() {
    //}
    getStyle (){
        const style =  this.constructor.style
        //const dStyle = {

        //}
        //return Object.assign({}, style, dStyle) 
        return style 
    } 

    renderLeftIcon(item, style ) {
        let leftIcon 
        if( ! item.queryStatus ) {
            leftIcon = sqlFailBadge()
        } else {
            if( ! item.unusualSample ) {
                leftIcon = filterSuccessBadge()
            
            } else {
                leftIcon = filterFailBadge()
            } 
        }
        return leftIcon
    }

    renderSample(item) {
        let retArr = []
        if( item.sampling.length ) {
            retArr.push  ( 
                          <Sample
                              sample={ item.sampling }
                              key={this.props.key}
                          />
                         )
        }

        return retArr 
    }
    render() {
        const style = this.getStyle() 
        const item = this.props.item
        let leftIcon  = this.renderLeftIcon( item ,style ) 
        //let sample = this.renderSample( item ) 
        const itemText = `${this.props.index+1}. ${ item.filter }` //表名
        const sampleView = this.renderSample(item) 
        
       return (
           <ListItem 
               primaryText={ itemText } 
               style={ style.listItem } 
               leftIcon ={ leftIcon }
               nestedLevel= {2}
               primaryTogglesNestedList={true}
               nestedItems={ sampleView }
           />
       )
    }
}
               //children={sample}
               //children={sample}
               //nesteditems={ sample }
               //primaryTogglesNestedList={true}

SubItem.propTypes = {
    item: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
}

SubItem.style = {
    listTextSpan: {
        float: 'left',
    },
    delIcon: {
        marginTop: '15px', 
    },
    lastDate: {
        float: 'right', 
        fontSize: '12px',
        fontStyle: 'italic',
        margin: '18px',
        color: 'rgba(93, 89, 89, 0.74)'
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

