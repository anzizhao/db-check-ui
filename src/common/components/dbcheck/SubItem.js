import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/List/ListItem';
import Badge from 'material-ui/Badge/Badge';

import  Immutable from 'immutable'

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
            // sql fail  red 
            leftIcon = (
                <Badge
                    badgeContent={''}
                    style={ style.badgeContent}
                    badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                />
            ) 
        } else {
            if( ! item.unusualSample ) {
                // pass  green 
                leftIcon = (
                    <Badge
                        badgeContent={''}
                        style={ style.badgeContent}
                        badgeStyle={{...style.badge, 'backgroundColor':'rgba(141, 197, 114, 0.56)'}} 
                    />
                ) 
            
            } else {
                // filter fail   blue 
                leftIcon = (
                    <Badge
                        badgeContent={''}
                        style={ style.badgeContent}
                        badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                    />
                ) 
            } 
        
        
        }
    }

    renderSample(item) {
        return [].push(
            <span>
               sample 
            </span>
        ) 
    }
    render() {
        const style = this.getStyle() 
        const item = this.props.item
        let leftIcon  = this.renderLeftIcon( item ,style ) 
        let sample = this.renderSample( item ) 
        
       return (
           <ListItem 
               primaryText={ item.filter } 
               style={ style.listItem } 
               leftIcon ={ leftIcon }
               nesteditems={ sample }
               nestedLevel= {2}
           />
       )
    }
}

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
    iconReply: {
        color: 'rgba(102, 214, 91, 0.89)',
    },
    iconATag: {
        color: 'rgba(102, 214, 91, 0.89)',
    },
    iconTag: {
        color: 'rgba(236, 192, 90, 0.84)',
    },
    editLabel: {
        cursor: 'pointer',
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


}

