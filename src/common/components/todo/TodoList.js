import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'


import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';

import FlatButton from 'material-ui/FlatButton/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import Badge from 'material-ui/Badge/Badge';

import Todo from './Todo'

import * as todoActions  from '../../actions/todo/actions'

var {exportFile, readFile } = require('../../util')

export default class TodoList extends Component {
    static contextTypes = {
        history: React.PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            allSelect: true ,
        };
    }
    componentDidMount(){
        //document.getElementById('importTodo').addEventListener('change', this.handleFileSelect, false);
        this.refs.importTodo.addEventListener('change', this.handleFileSelect.bind(this), false)
    }

    handleFileSelect(event){
        let files = event.target.files; 
        readFile(files[0], (fileStr)=>{
            let fileJson = JSON.parse(fileStr)
            this.props.actions.importTodo(fileJson, files[0].name) 
        }) 
    }

    handleImportClick(e){
        e.preventDefault();  
        document.getElementById('importTodo').value='';
        document.getElementById('importTodo').click()
    }

    handleAsync (e){
        e.preventDefault();  
        this.props.actions.asyncLocal( this.props.todos)
    }

    handleSaveDiff (e){
        e.preventDefault();  
        //传入视图的todos
        //this.props.actions.saveDiff( this.props.todos, this.props.asyncTodos )
        //传入本地所有的todos
        this.props.actions.saveDiff( this.props.allTodos , this.props.asyncTodos )
    }

    getStyle (){
        const style =  this.constructor.style
        const dStyle = {}
        return Object.assign({}, style, dStyle) 
    } 

    _selectMode(){
        return this.props.mode ===   todoActions.todoMode.select
    }

    clickCheckbox(e, checked){
        // 这个的确是不需要的
        //e.preventDefault()
        const { actions } = this.props
        const value =  checked
        this.setState({
            allSelect: value 
        })
        actions.selectAllTodo(value)
    }


    renderBanner (){
        const { actions } = this.props
        const style = this.getStyle() 
        const butLable = this._selectMode() ? "退出选择" : "选择"
                            //checked={ this.allSelect }
                            //checked={ this.state.allSelect }
                            //onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
        return (
            <div  className="todo-list-banner" >
                <div>
                    <FlatButton label=  { butLable }
                        style ={style.selectBut } 
                        onClick={e => actions.toggleSelectMode() }
                        primary={true}  
                    />
                </div>
                {
                    this._selectMode() 
                    && 
                     <div style={ style.selectLabel }>
                        <Checkbox
                            label="全选"
                            //checked={ this.allSelect }
                            checked={ this.state.allSelect }
                            onCheck={ (e, checked)=> { this.clickCheckbox(e, checked) }} 
                        />
                    </div>
                }
                <div  style={ style.todosInfo }>
                    <span>
                        { `${this.props.todos.size} /${this.props.todosInfo.total}`}
                    </span>
                </div>

                <div  className="mertic-tips">
                    <span>
                        重要=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 255, 66, 0.56)'}} 
                        />
                        紧急=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(244, 67, 54, 0.56)'}} 
                        />

                        困难=
                        <Badge
                            badgeContent={''}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(3, 169, 244, 0.56)'}} 
                            style={ style.badgeContent}
                        />
                    </span>
                    <br/>
                </div>
            </div>
        )
    }

    exportSelect (e){
        const { actions } = this.props
        actions.exportSelect()
    }

    exportPage(e){
        const { actions } = this.props
        actions.exportPage()
    }

    delSelect(e){
        const { actions } = this.props
        actions.delSelect()
    }

    renderOpGrounp() {
        const { actions } = this.props
        const style = this.getStyle() 
        if( this._selectMode() ) {
            return (
                <div  className="todolistOpGroup">
                    <FlatButton label="导出所选" 
                        onClick={ this.exportSelect.bind(this) }  
                        style={ style.flatButton }  
                    />
            </div>
            )

        } else {
            return (
                <div  className="todolistOpGroup">
                    <FlatButton label="同步" 
                        onClick={(e) => this.handleSaveDiff(e) }  
                        style={ style.flatButton }  
                    />

                    <FlatButton label="导出" 
                        onClick={ this.exportPage.bind(this) }  
                        style={ style.flatButton }  
                    />

                    <FlatButton label="导入" 
                        onClick={(e) => this.handleImportClick(e) }  
                        style={ style.flatButton }  
                    />

            </div>
            )

        }
    }




    render() {
        const { actions, tags, mode, todos } = this.props

        const style = this.getStyle() 
        const todoLen = todos.size 
        return (           
                <div  className="todoList">
                 { this.renderBanner () }
                <List  style={style.list}>
                { todos.map((todo, index)  =>
                                      <Todo {...todo}
                                          index={ todoLen - index - 1}
                                          actions={actions}
                                          allTags={ tags }
                                          mode={mode}
                                          key={todo.get("uuid")}
                                          todo={todo}
                                          fromfiles= { this.props.fromfiles }
                                          onClick={() => this.props.onTodoClick} />
                                     )}


                </List>
                <Divider inset={true}/>

                 { this.renderOpGrounp() }
                <input type="file" id="importTodo" ref='importTodo'   style={{ display: 'none'}} />
                <br/>
            </div>
        )
    }
}

TodoList.propTypes = {
  actions: PropTypes.object.isRequired,
  onTodoClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  tags: React.PropTypes.instanceOf(Immutable.List),
}

TodoList.style = {
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
    todosInfo: {
        float: 'left',
        fontSize: 13,
        margin: '10px',
        marginLeft: '30px',
        fontWeight: 500,
    }
}
