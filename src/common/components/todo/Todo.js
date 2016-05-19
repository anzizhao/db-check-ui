import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';


import * as todoActions  from '../../actions/todo/actions'
import  Immutable from 'immutable'

import ListItem from 'material-ui/List/ListItem';
import Checkbox from 'material-ui/Checkbox';


export default class Todo extends Component {
    constructor(props){
        super(props) 
    }
    shouldComponentUpdate (nProps, nState) {
    }
    getStyle (){
        const style =  this.constructor.style
        const todo  = this.props.todo.toObject()
        const dStyle = {
            listItemDiv: {
                display:  todo.collapse ? 'block' : 'none'
            },
            listTextSpan: {
                textDecoration: todo.completed ? 'line-through' : 'none',
            },
        }
        return Object.assign({}, style, dStyle) 
    } 

    clickCheckbox(e, checked, todo ){
        const value =  checked
        this.props.actions.selectTodo(todo.uuid , value)
    }


    render() {
        const { actions } = this.props
        const style = this.getStyle() 
        const todo = this.props.todo.toObject()

        //const listText =  this.renderText(style ,todo) 
        const secondText = ! todo.conclusion ? '': 
            ( 
             <span  style= {style.secondtext} > 
                 结论:  { todo.conclusion.text }
             </span>
            ) 
            let leftCheckbox, subItems  
            let rightIconMenu  = <span></span>

            //secondaryText = {<SubSecondaryText text={secondText} />}
            return (
                <div className="todo-item">
                    <div style={style.listItemDiv }>
                        <ListItem 
                            primaryText={ "TODO"} 
                            style={style.listItem }
                            primaryTogglesNestedList={true}
                            secondaryText = {secondText}
                            secondaryTextLines =  {2}
                        />
                    </div>
                </div>
            )
    }

}

Todo.propTypes = {
    todo: React.PropTypes.instanceOf(Immutable.Map),
    actions: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    mode: PropTypes.number.isRequired,
    fromfiles: React.PropTypes.instanceOf(Immutable.List),
    onClick: PropTypes.func.isRequired,
    allTags: React.PropTypes.instanceOf(Immutable.List),
}

//static style 
Todo.style = {
    listTextSpan: {
        float: 'left',
    },
    selectTag:{
        width: "100%" 
    } 

}
