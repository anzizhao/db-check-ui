import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ListItem from 'material-ui/List/ListItem';
import Badge from 'material-ui/Badge/Badge';

import  Immutable from 'immutable'
import Sample from './sample'
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
                    badgeStyle={
                        {
                            ...style.badge, 
                            'background':' linear-gradient(to right, rgb(243, 8, 8), rgb(93, 214, 38) )',
                    }} 
                />
            ) 
        } else {
            if( ! item.unusualSample ) {
                // pass  green 
                leftIcon = (
                    <Badge
                        badgeContent={''}
                        style={ style.badgeContent}
                        badgeStyle={{...style.badge, 'backgroundColor':'rgb(93, 214, 35)'}} 
                    />
                ) 
            
            } else {
                // filter fail   blue 
                leftIcon = (
                    <Badge
                        badgeContent={''}
                        style={ style.badgeContent}
                        badgeStyle={{...style.badge, 'backgroundColor':'rgb(13, 163, 230)'}} 
                    />
                ) 
            } 
        }
        return leftIcon
    }

    renderSample(item) {
        const sample = (
            <Sample
                sample={ item.sampling }
            />
        )
        return (
           <ListItem 
               primaryText={ "样本"} 
               children={sample}
           />
        ) 
    }
    render() {
        const style = this.getStyle() 
        const item = this.props.item
        let leftIcon  = this.renderLeftIcon( item ,style ) 
        //let sample = this.renderSample( item ) 
        const itemText = `${this.props.index+1}. ${ item.filter }` //表名
        const sample = (
            <Sample
                sample={ item.sampling }
            />
        )
        
       return (
           <ListItem 
               primaryText={ itemText } 
               style={ style.listItem } 
               leftIcon ={ leftIcon }
               nestedLevel= {2}
               key={this.props.key}
           />
       )
    }
}
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
        width: '20px',
        height: '20px',
    },
    badgeContent:{
        padding: '24px 24px 12px 0' ,
        marginRight: '5px',
    },


}

