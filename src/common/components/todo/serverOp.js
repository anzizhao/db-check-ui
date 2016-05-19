import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';

import  Immutable from 'immutable'

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import Divider from 'material-ui/lib/divider';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import FlatButton from 'material-ui/lib/flat-button';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import Checkbox from 'material-ui/lib/checkbox';

import { VisibilityFilters } from '../../actions/todo/actions'

import  { objEqual } from '../../util'

export default class ServerOp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: 1,
            startDate: this.today(), //默认查询当天内容
            endDate: this.todayEnd(),
            status: VisibilityFilters.SHOW_ACTIVE,    // 搜索的状态 

            allSearchType: false,
            allSearchDate: false,
        };
    }

    shouldComponentUpdate(nProps, nState) {
        if ( ! objEqual(nState, this.state ) ) {
            return true  
        }
        return false 
    }
    today = () => {
        const now = new Date()
        const nowDayTime = Date.now() - 1000 * ( now.getSeconds() + 60* now.getMinutes() + 3600 * now.getHours() )
        return new Date(nowDayTime)
    };

    todayEnd = () => {
        const dayUnit = 24*3600*1000
        const end  = this.today().getTime()  + dayUnit - 1000
        return new Date(end) 
    };

    handleChange = (event, index, value) => this.setState({searchType: value});

    // search type 
    handleSearchType = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const value = findDOMNode(this.refs.searchContent ).getElementsByTagName('input')[0].value
        const text = value.trim()
        switch ( this.state.searchType ) {
            case 1: 
                this.props.actions.queryText(text)
                break
            case 2: 
                this.props.actions.queryTag(text)
                break
            case 3: 
                this.props.actions.queryFile(text)
                break
            //case 4: 
                //this.props.actions.queryComplete()
                //break
            //case 5: 
                //this.props.actions.queryDoing()
                //break
        }
    };

    handleSearchDate = (e) => {
        e.preventDefault()
        const st = this.state.startDate.getTime()
        const et = this.state.endDate.getTime()
        this.props.actions.queryDate(st, et )

    };

    //TODO 实现 search all 
    handleSearchAll = (e) => {
        e.preventDefault()
        let options = {}
        if( this.state.allSearchType ) {
            const value = findDOMNode(this.refs.searchContent ).getElementsByTagName('input')[0].value
            const text = value.trim()
            options.content = {
                text 
            } 
            switch(this.state.searchType) {
                case 1: 
                    options.content.type = 'text'
                    break
                case 2: 
                    options.content.type = 'tag'
                    break
                case 3: 
                    options.content.type = 'file'
                    break
            }
        } 
        if ( this.state.allSearchDate ) {
            const startTimestamp = this.state.startDate.getTime()
            const endTimestamp = this.state.endDate.getTime()
            options.date = {
                startTimestamp ,
                endTimestamp
            } 
        }
        options.status = this.state.status
        this.props.actions.queryCommon(options)
    };

    startDateChange = (e, date)  => {
        this.setState({
            startDate: date,
        }); 
    };


    endDateChange = (e, _date)  => {
        //一天的结束
        const date = new Date( _date.getTime() + 24*3600*1000 - 1 ) 
        this.setState({
            endDate: date,
        }); 
    };

    handleSelectRadio = (e, value )  => {
        this.setState({
            status: value,
        }); 
    };

    // 函数工厂
    createCheckboxChange (type ) {
        return  (e, checked ) => {
            this.setState({
                [type] : checked,
            }); 
        }
    }

    renderSearch(style){
        const items = [
          <MenuItem key={1} value={1} primaryText="内容"/>,
              <Divider key={110}/>,
          <MenuItem key={2} value={2} primaryText="标签"/>,
              <Divider key={111}/>,
          <MenuItem key={3} value={3} primaryText="文件"/>,
              <Divider key={112}/>,
          //<MenuItem key={4} value={4} primaryText="完成"/>,
              //<Divider key={113}/>,
          //<MenuItem key={5} value={5} primaryText="进行"/>,
              //<Divider key={114}/>,
        ];

                //<div style={style.inlineDiv}>
                        //floatingLabelText="搜索类型"
                        //floatingLabelStyle ={style.selectFloat }
        return (
            <div className="footer-sort">
                <Checkbox
                    style={ style.checkbox }
                    onCheck={ this.createCheckboxChange('allSearchType') } 
                    checked={ this.state.allSearchType }
                />
                <SelectField
                    floatingLabelText="搜索类型"
                    floatingLabelStyle ={style.selectFloat }
                    style={ style.select }

                    labelStyle = { style.selectLabel }
                    value={ this.state.searchType } 
                    onChange={this.handleChange}
                >
                    {items}
                </SelectField>
                <TextField
                    floatingLabelText="输入搜索内容，支持正则,Enter键确认"
                    floatingLabelStyle={ style.floatingLabelStyle }
                    style={ style.searchText }
                    ref="searchContent" 
                />
                <FlatButton 
                    label="查询" 
                    style={ style.flatButton }
                    onClick={ this.handleSearchType }
                />
            </div>
        ) 
    }

    renderDate(style){
        return (
            <div style={ style.date }>
                <Checkbox
                    style={ style.checkbox }
                    onCheck={ this.createCheckboxChange('allSearchDate') } 
                    checked={ this.state.allSearchDate }
                />
                <DatePicker 
                    hintText="开始日期"  
                    style={ style.startDate }
                    value={this.state.startDate }
                    onChange={ this.startDateChange }
                    wordings={{ok: '确认', cancel: '取消'}}
                /> 
                <DatePicker 
                    hintText="结束日期"  
                    style={ style.overDate }
                    value={this.state.endDate }
                    onChange={ this.endDateChange }
                    wordings={{ok: '确认', cancel: '取消'}}
                /> 
                <FlatButton 
                    label="查询" 
                    style={ style.flatButton }
                    onClick={ this.handleSearchDate}
                />
            </div>
        ) 
    }

    renderStatus(style){
        return (
            <RadioButtonGroup 
                name="shipSpeed" 
                style = { style.radioGroup }
                defaultSelected={ VisibilityFilters.SHOW_ACTIVE }
                onChange = { this.handleSelectRadio }
            >
                <RadioButton
                    value={ VisibilityFilters.SHOW_ALL }
                    label="全部的"
                    labelStyle ={ style.radioLabel }
                    style={ style.radio }
                />
                <RadioButton
                    value={ VisibilityFilters.SHOW_COMPLETED } 
                    label="完成的"
                    labelStyle ={ style.radioLabel }
                    style={ style.radio }
                />
                <RadioButton
                    value={ VisibilityFilters.SHOW_ACTIVE } 
                    label="进行的"
                    labelStyle ={ style.radioLabel }
                    style={ style.radio }
                />
            </RadioButtonGroup>
        ) 
    }

    render() {
        const style = this.constructor.style 
        return (
            <div className="footer todo-server-op">
                {this.renderSearch(style)}
                {this.renderDate(style)}
                {this.renderStatus(style)}



                <FlatButton 
                    label="综合查询" 
                    style={ style.allSearchBut }
                    onClick={ this.handleSearchAll }
                />
            </div>
        )
    }
}

ServerOp.propTypes = {
    actions: PropTypes.object.isRequired,
}

ServerOp.style = {  
    searchText: {
        marginLeft: '20px',
        width: '600px',
        background: 'transparent',
        color: 'white',
        display: 'inline-block',
        verticalAlign: 'bottom',
    },
    floatingLabelStyle: {
        color: 'white',
        fontSize: '15',
        fontStyle: 'italic'
    },
    inlineDiv: {
        display: 'inline-block',
    },
    selectFloat: {
        color: 'white' ,
    },
    select: {
        width: '100px',
        color: 'white' ,
    },
    selectLabel: {
        color: 'white' ,
    },
    date: {
        display: 'inline-block',
    },
    startDate: {
        display: 'inline-block',
        color: 'white' ,
        margin: '20px 0'
    },
    overDate: {
        display: 'inline-block',
        marginLeft: '20px',
        color: 'white' ,
    },
    flatButton: {
        border: '1px solid white',
        borderRadius: '25px',
        color: 'white' ,
        height: '35px',
    },
    allSearchBut: {
        border: '1px solid white',
        borderRadius: '25px',
        color: 'white' ,
        height: '35px',
        margin: '20px',
        display: 'block'
    },
    checkbox: {
        width: '40px',
        height: '20px',
        marginLeft: '20px',
        display: 'inline-block'
    },
    radioGroup: {
        margin: '40px 0 0 15px',
    },
    radioLabel: {
        color: 'white', 
        fontSize: '15',
    },
    radio: {
        width: '150px',
        height: '40px',
        margin: '5px 5px 0 5px',
        display: 'inline-block'
    },
}




