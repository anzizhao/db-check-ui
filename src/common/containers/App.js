import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton/FlatButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


import {Map, List} from 'immutable'

import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters, exportTodo, initAll  } from '../actions/todo/actions'

import * as todoActions  from '../actions/todo/actions'
import TodoList from '../components/todo/TodoList'

import visibleTodos from '../components/todo/visibleTodos'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LightBaseTheme from  'material-ui/styles/baseThemes/lightBaseTheme'


class App extends Component {
    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            showOpDlg: false,
        };
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(LightBaseTheme)
        };
    }


    componentWillMount() {
        //初始化todo 和 tags
        //this.props.dispatch(initTodo());
        //this.props.dispatch(initTags());
        //this.props.dispatch(initAll());
        this.props.actions.initAll()
    }

    //componentDidMount(){
        //if(! this.props.user.get('todoAsync') ) {
            //this.props.actions.asyncLocal( this.props.allTodos )
        //}
    //}

    componentWillReceiveProps (np){
    }

    _selectMode(){
        return this.props.mode ===   todoActions.todoMode.select
    }
    selectFilterFile(e) {
        // target options array,  the last ele id is empty '', that means add new value
        var opts = e.target.selectedOptions
        //if( ! opts || ! opts.length ){
        //return 
        //} 
        var files = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            files.push(
                { id: item.id, text:item.text }
            ) 
        }
        this.props.actions.selectFile(files)

        // target options array,  the last ele id is empty '', that means add new value
        //var opts = e.target.selectedOptions
        //var filename = ''
        //var ele = opts[0]
        //var text = ''
        //if ( ele.index !== 0) {
        //text = ele.text 
        //}
        //this.props.actions.selectFile(text)
    }

    onFilterChange = ( filter ) => {
        this.props.actions.setVisibilityFilter(filter)
    };
    onSortChange = ( sort ) => {
        this.props.actions.setSort( sort )
    };



    handleClose = () => {
        this.setState({showOpDlg: false});
    };

    handleOpen = () => {
        //this.setState({ showOpDlg: true, }) 
    };

    onExportClick = () => {
        this.props.actions.exportTodo()        
    };
    onTodoClick = (id) => {
        this.props.actions.completeTodo (id)        
    };

    render() {
        const style = {
            floatButton: {
                position: 'fixed',
                bottom : '100px',
                right: '10%',
            },
            dialogContent: {
                maxWidth: '60rem',
            },
            titleStyle: {
                color: 'white',
            },
            headline: {
                fontSize: 24,
                paddingTop: 16,
                marginBottom: 12,
                fontWeight: 400,
            },
            tabs: {
                background: 'transparent',  
            },
            container: {
            }
        }
        const { dispatch, visibleTodos,  actions, tags, mode} = this.props

        return (
            <div className="container content" style={style.container}>
                <TodoList
                    todos={visibleTodos}
                    allTodos={this.props.allTodos }
                    todosInfo={this.props.todosInfo }
                    actions={actions}
                    mode={mode}
                    tags={tags}
                    asyncTodos={this.props.asyncTodos}
                    fromfiles={this.props.fromfiles}
                    onExportClick={ this.onExportClick }
                    onTodoClick={ this.onTodoClick } 
                    user={ this.props.user }
                />


            <FloatingActionButton 
                secondary 
                style={ style.floatButton } 
                onClick ={ this.handleOpen  }
            >
                <ContentAdd />
            </FloatingActionButton>

        </div>
        )
    }
}

            //{ this.renderFooter() }
App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    visibleTodos: React.PropTypes.instanceOf(List),
    asyncTodos: React.PropTypes.instanceOf(List),
    fromfiles: React.PropTypes.instanceOf(List),
    selectFiles: React.PropTypes.instanceOf(List),
    allTodos: React.PropTypes.instanceOf(List),

    sort: React.PropTypes.instanceOf(List),
    tags :  React.PropTypes.instanceOf(List),
    selectTags:  React.PropTypes.instanceOf(List),
    filter: React.PropTypes.instanceOf(Map),
    filterDate: React.PropTypes.instanceOf(Map),

    visibilityFilter: PropTypes.oneOf([
        'SHOW_ALL',
        'SHOW_COMPLETED',
        'SHOW_ACTIVE'
    ]).isRequired,

    actions: PropTypes.object.isRequired,
    mode: PropTypes.number.isRequired,
    todosInfo: PropTypes.object.isRequired,
    status: React.PropTypes.instanceOf(Map).isRequired,
}


function select(state) {
    let t  = state.todo
    return {
        //undoDisabled: t.todos.past.length === 0,
        //redoDisabled: t.todos.future.length === 0,
        user: state.user,
        layout : state.layout,
        undoDisabled: false ,
        redoDisabled: false , 
        visibilityFilter: t.visibilityFilter,
        sort: t.sort,
        tags: t.tags,
        mode: t.mode,
        selectFiles: t.selectFiles,
        selectTags: t.selectTags,
        fromfiles: t.fromfiles,
        filter: t.filter,
        filterDate: t.filterDate,
        allTodos: t.todos,
        status: t.status,
        asyncTodos: t.asyncTodos,
        visibleTodos: visibleTodos (t),
        // 这里添加, 显示作用
        todosInfo:  {
            total: t.todos.size,
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        actions: bindActionCreators(todoActions, dispatch)
    }
}

export default connect(select, mapDispatchToProps)(App)
//module.exports = connect(select, mapDispatchToProps)(App)
