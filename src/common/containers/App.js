import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import FlatButton from 'material-ui/FlatButton/FlatButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


import { Map, List } from 'immutable'

import * as actions from '../actions/dbcheck'
import VList from '../components/dbcheck/vList'
import Filter from '../components/dbcheck/filter'

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
                maxWidth: '43rem',
            }
        }

        const { items, actions } = this.props
        return (
            <div className="container content" style={style.container}>
                <Filter
                    actions={actions}
                    filter ={this.props.filter}
                />

                <VList
                    actions={actions}
                    items={items}
                    info={ this.props.info }
                />
            </div>
        )
    }
}

App.propTypes = {
    actions: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
    items: React.PropTypes.instanceOf(List ),
    filter: React.PropTypes.instanceOf(Map),
}


function select(state) {
    let info = {
        number: 0
    }
    if( state.dbcheck.db.reports ) {
        info.number = state.dbcheck.db.reports.size
    }
    return {
        items: visibleList( state.dbcheck.db.reports, state.dbcheck.filter) ,
        filter:  state.dbcheck.filter ,
        info 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions , dispatch)
    }
}

export default connect(select, mapDispatchToProps)(App);
//module.exports = connect(select, mapDispatchToProps)(App)
