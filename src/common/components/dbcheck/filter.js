import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField/TextField';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Divider from 'material-ui/Divider';

import {sortType, status } from '../../actions/dbcheck'
import  { stateEqual } from '../../util'
import { sqlFailBadge, filterFailBadge, filterSuccessBadge } from './statusBadge'

export default class Filter extends Component {

    constructor(props){
        super(props);
        this.state = {
            sortType:  sortType.table,
            status :  status.all ,
            searchText:'' ,
            url:'' ,
        }
    }
    componentWillReceiveProps(np ) {
        if( np.filter !== this.props.filter  ) {
            if( np.filter.get('text') !== this.props.filter.get('text') ) {
                let text = ''
                if( np.filter.getIn(['text', 'use']) ) {
                    text = np.filter.getIn(['text', 'text']) 
                }
                this.setState( {
                    searchText:  text
                })
            }

            if( np.filter.get('status') !== this.props.filter.get('status') ) {
                let status = ''
                this.setState({
                    status : np.filter.getIn(['status', 'type']) 
                })
            }
        } 
    
    }
    shouldComponentUpdate(np, ns) {
        if( np.filter !== this.props.filter || ! stateEqual(ns, this.state ) ) {
            return  true 
        } 
        return false 
    }
    handleChange = (event, index, value) =>{
        event.preventDefault()
        this.setState({
            sortType: value 
        })
    };

    handleChangeStatus  = (event, index, value ) =>{
        event.preventDefault()
        this.setState({
            status: value 
        })
    };
    handleChangeText = (event, value ) =>{
        event.preventDefault()
        this.setState({
            searchText: value  
        })
    };
    handleChangeUrl = (event, value ) =>{
        event.preventDefault()
        this.setState({
            url: value  
        })
    };

    handleExecute = ( event ) =>{
        event.preventDefault()

        let opt = {
            text: this.state.searchText, 
            status: this.state.status,
            sort: this.state.sortType,
        }
        this.props.actions.toFilter(opt)
    };

    handleUrlKeyDown = (e, _value ) => {
        //e.preventDefault()
        if( e.keyCode !== 13 ) {
            return  
        }
        const value =  e.target.value 
        if( ! value ||  value === '' ) {
            return  
        }
        this.props.actions.fetchUrl( value )
    };

    renderSort (style){
        const items = [
          <MenuItem key={1} value={sortType.table} primaryText="表名"/>,
              <Divider key={110}/>,
          <MenuItem key={2} value={sortType.executeDesc} primaryText="执行时间长"/>,
              <Divider key={111}/>,
          <MenuItem key={3} value={sortType.executeAsc} primaryText="执行时间短"/>,
        ];

        return (
            <div 
                style={{ display: 'inline-block'}} 
            >
                <span>
                    <h4> 排序: </h4>
                </span>
                <SelectField
                    floatingLabelText="排序类型"
                    value={ this.state.sortType } 
                    onChange={ this.handleChange }
                >
                    { items }
                </SelectField>
            </div>
        ) 
    }

    renderStatus ( style ){
        const icons = [
            sqlFailBadge(),
            filterSuccessBadge(),
            filterFailBadge()
        ]

        const items = [
            <MenuItem 
                key={0} 
                value={ status.all } 
                primaryText="默认"
            />,
            <Divider key={210}/>,
            <MenuItem 
                key={3} 
                value={ status.sqlFail } 
                primaryText="sql失败"
                rightIcon={ icons[0] }
            />,
            <Divider key={213}/>,
            <MenuItem 
                key={1} 
                value={status.success } 
                primaryText="过滤成功"
                rightIcon={ icons[1] }
            />,
            <Divider key={212}/>,
            <MenuItem 
                key={2} 
                value={ status.filterFail } 
                primaryText="过滤失败"
                rightIcon={ icons[2] }
            />,
        ];

        return (
            <div 
                style={{ display: 'inline-block'}} 
            >
                <SelectField
                    floatingLabelText="执行状态"
                    style={ style.selectField }
                    value={ this.state.status } 
                    onChange={ this.handleChangeStatus }
                >
                    { items }
                </SelectField>
            </div>
        ) 
    }
                    //floatingLabelStyle ={style.selectFloat }
                    //style={ style.select }
                    //labelStyle = { style.selectLabel }
    renderText ( style ) {
        return (
            <div 
                style={{ display: 'inline-block'}} 
            >
                <span> 搜索: </span>
                <TextField
                    hintText="输入表名"
                    hintStyle={style.hintStyle}
                    style={ style.textField }
                    value={ this.state.searchText }
                    onChange= { this.handleChangeText }
                />
            </div>
        )
    
    }
    renderUrl( style ){
        return (
            <div>
                <TextField
                    hintText="输入url, 按Enter确认"
                    hintStyle={style.hintStyle}
                    style={ style.urlTextField }
                    value={ this.state.url }
                    onChange= { this.handleChangeUrl }
                    onKeyDown = { this.handleUrlKeyDown }
                    ref="url" 
                />
            </div>
        )
         
    }
                    //onKeyDown = { this.handleUrlKeyDown }
    render() {
        const style = this.constructor.style 
        return (
            <div 
                style={{ marginTop: "50px" }} 
            >

                {this.renderUrl (style)}

                {this.renderStatus(style)}
                {this.renderText(style)}
                <FlatButton 
                    label="执行" 
                    onClick={ this.handleExecute }
                    primary
                />
            </div>
        )
    }
}


Filter.propTypes = {
  actions: PropTypes.object.isRequired,
  filter: React.PropTypes.instanceOf(Immutable.Map).isRequired,
}

Filter.style = {
    flatButton: {
        border: '1px solid white',
        borderRadius: '25px',
        color: 'white' ,
        height: '35px',
    },
    hintStyle: {
        fontSize: 12,
    },
    textField: {
        marginLeft: '20px',
        width: '400px',
        background: 'transparent',
        color: 'white',
    },
    urlTextField: {
        width: '600px',
        background: 'transparent',
        color: 'white',
    },
    selectField: {
        width: '200px',
    },
}
