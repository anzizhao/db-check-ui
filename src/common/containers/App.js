import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton/FlatButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


import { Map, List } from 'immutable'

import * as actions from '../actions/dbcheck'
import VList from '../components/dbcheck/vList'

import visibleList from '../components/dbcheck/visibleList'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import LightBaseTheme from  'material-ui/styles/baseThemes/lightBaseTheme'


class App extends Component {
    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };
    constructor(props) {
        super(props);
    }

    getChildContext() {
        return {
            muiTheme: getMuiTheme(LightBaseTheme)
        };
    }
    componentDidMount() {
        this.props.actions.initDbcheck()
    }

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

        const { items, actions } = this.props
        return (
            <div className="container content" style={style.container}>
                <VList
                    actions={actions}
                    items={items}
                />
            </div>
        )
    }
}

App.propTypes = {
    actions: PropTypes.object.isRequired,
    items: React.PropTypes.instanceOf(Map),
}


function select(state) {
    return {
        items: visibleList( state.dbcheck.db )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions , dispatch)
    }
}

export default connect(select, mapDispatchToProps)(App);
//module.exports = connect(select, mapDispatchToProps)(App)
