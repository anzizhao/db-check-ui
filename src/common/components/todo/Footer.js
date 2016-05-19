import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'
import FooterFromfile from './footerFromfile.js';
import ImuSelectTags from './imuSelectTags';
import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import Toggle from 'material-ui/lib/toggle';
import Checkbox from 'material-ui/lib/checkbox';

import  { objEqual } from '../../util'

class FilterText extends Component {
    shouldComponentUpdate(nProps, nState) {
        if( nProps.filter !== this.props.filter )  {
            return true  
        }
        return false 
    }
    handleEnterKeyDown(e) {
        e.preventDefault()
        const value =  e.target.value 
        if ( value ) {
            const text = value.trim()
            this.props.actions.filterText(text)
            //this.props.actions.queryText(text)
        } else {
            // 取消率选
            this.props.actions.filterText()
        }
    }
    render() {
        const style = this.constructor.style 
        return (
              <div  className="footer-item" id='footer-filter'>
                <span>搜索: </span>
                <TextField
                    hintText="输入搜索内容，支持正则, Enter键确认"
                    hintStyle={style.hintStyle}
                    style={ style.textField }
                    defaultValue={ this.props.filter.get('todoText') || '' }
                    onEnterKeyDown = {(e) => this.handleEnterKeyDown (e) }
                />
              </div>
        )
    }
}

FilterText.propTypes = {
    actions: PropTypes.object.isRequired,
    filter: React.PropTypes.instanceOf(Immutable.Map).isRequired,
}

FilterText.style = {  
    textField: {
        marginLeft: '20px',
        width: '600px',
        background: 'transparent',
        color: 'white',
    },
    hintStyle: {
        color: 'white',
        fontSize: '12',
        fontStyle: 'italic'
    }
}


class FilterDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.today(), //默认查询当天内容
            endDate: this.todayEnd(),
            isUsed: false,
        };
    }

    componentWillMount () {
        const filterDate = this.props.filterDate.toObject() 
        this.setState({
            startDate: filterDate.startTimestamp ?  new Date( filterDate.startTimestamp ): this.today() , 
            endDate:  filterDate.endTimestamp ?  new Date( filterDate.endTimestamp ): this.todayEnd(),
            isUsed: filterDate.isUsed,
        });
    }

    componentWillReceiveProps (nProps) {
        const filterDate = nProps.filterDate.toObject() 
        this.setState({
            startDate: filterDate.startTimestamp ?  new Date( filterDate.startTimestamp ): this.today() , 
            endDate:  filterDate.endTimestamp ?  new Date( filterDate.endTimestamp ): this.todayEnd(),
            isUsed: filterDate.isUsed,
        });
    }

    shouldComponentUpdate(nProps, nState) {
        if( nProps.filterDate !== this.props.filterDate
           || ! objEqual(nState, this.state ) 
          )  {
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

    checkboxChange= (e, checked ) => {
        this.setState({
            isUsed : checked,
        }); 
    };

    //不需要时间过滤
    handleToggle = (e, toggle ) => {
        e.preventDefault()
        //console.log('toggle', toggle )
        const st = this.state.startDate.getTime()
        // 结束时间为一天的末尾
        const et = this.state.endDate.getTime() 
        this.props.actions.lfilterDate (toggle , st, et )
    };

    handleSearchDate = (e) => {
        e.preventDefault()
        const st = this.state.startDate.getTime()
        const et = this.state.endDate.getTime()
        const toggle = this.state.isUsed 
        this.props.actions.lfilterDate (toggle , st, et )
    };


    render() {
        const style = this.constructor.style 
        return (
            <div 
                style={ style.date }
                className="footer-item" 
            >
                <span>日期: </span>
                <Checkbox
                    style={ style.checkbox }
                    checked={ this.state.isUsed }
                    onCheck={ this.checkboxChange } 
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
                    label="过滤日期" 
                    style={ style.flatButton }
                    onClick={ this.handleSearchDate }
                />
            </div>
        )
    }
}

FilterDate.propTypes = {
    actions: PropTypes.object.isRequired,
    filterDate: React.PropTypes.instanceOf(Immutable.Map).isRequired,
}
FilterDate.style = {  
    date: {
        display: 'inline-block',
    },
    startDate: {
        display: 'inline-block',
        color: 'white' ,
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
    toggle: {
        display: 'inline-block',
        marginBottom: 16,
    },
    checkbox: {
        width: '40px',
        height: '20px',
        marginLeft: '20px',
        display: 'inline-block'
    },

}

export default class Footer extends Component {
    style = {
        showTip : {
            marginRight: '15px' ,
        } ,
        a: {
            fontSize: '15px' ,
            cursor: 'pointer',
            color: '#535353',
            margin: '2px 5px',
        } ,
        selectFilter: {
            marginLeft: '10px', 
            fontSize: '15px' ,
            cursor: 'pointer',
            color: '#1db7a9',
            margin: '2px 5px',
        }
    };

    constructor(props){
        super(props);
        this.onAddSort = this.onAddSort.bind(this)
        this.onDelSort = this.onDelSort.bind(this)
    }

    handleTagChange(e) {
        var opts = e.target.selectedOptions
        if( ! opts || ! opts.length ){

            this.props.actions.changeFilterTags()
            return 
        } 
        // 这个不需要render的
        var tags = []
        for(let i=0; i<opts.length; i++) {
            let item = opts[i]
            tags.push(
                {id: item.id, text:item.text }
            ) 
        }
        this.props.actions.changeFilterTags(tags )
    }
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return (
         <span style={this.style.selectFilter }> { name } </span>
         )
    }

    return (
      <a href="#" onClick={e => {
        e.preventDefault()
        this.props.onFilterChange(filter)
      }}
        style={ this.style.a } 
      >
        {name}
      </a>
    )
  }

  renderFilters() {
    return (
      <p className='footer-filters'>
        <span style={this.style.showTip }>状态: </span>
        {this.renderFilter('SHOW_ALL', '全部')}
        {this.renderFilter('SHOW_COMPLETED', '完成的')}
        {this.renderFilter('SHOW_ACTIVE', '进行的')}
      </p>
    )
  }

  onDelSort(e, cmd) {
        e.preventDefault()
        this.props.actions.delSort(cmd)
  }

  onAddSort(e, cmd, desc) {
        e.preventDefault()
        this.props.actions.addSort(cmd, desc)
  }

  handleInitState = (e) => {
        e.preventDefault()
        this.props.actions.initFilterState()
  };

  renderSort ( type ) {
    let result = this.props.sort.find( sort => type.cmd=== sort.cmd && type.desc === sort.desc )
    if ( result ) {
        return (
            <a
                style={this.style.selectFilter }
                onClick={e => this.onDelSort(e, type.cmd)}
            > 
                { type.name  } 
            </a>
        )
    } else {
        return (
            <a 
                onClick={e => this.onAddSort(e, type.cmd, type.desc )}
                style={ this.style.a } 
            >
                { type.name  } 
            </a>
        )
    }
  }
        //{this.renderSort('SORT_ORIGIN', '默认')}
        //{', '}
  renderSortResult(sorts, relate ){
      if( sorts.length === 0 ) {
            return <span></span> 
      } else {
          return (
              <span className="sort-result">
                  {
                      sorts.map((sort, index) =>{
                                let result  
                                for(let r in relate ) {
                                    if( relate[r].cmd === sort.cmd && relate[r].desc === sort.desc )  {
                                        result = relate[r] 
                                        break
                                    }
                                }
                                if ( ! result ) {
                                    return <span key={index} ></span> 
                                }
                                return (
                                      <span key={index} >
                                          { result.name }
                                          { index <  sorts.length-1 &&  '<- ' }
                                      </span> 
                                ) 
                      }) 
                  }
              </span> 
          ) 
      } 
  }
  renderSorts() {
    const sorts = this.props.sort.toArray() 
    const relate = {
        importance: {
                name: '重要',
                desc: true,
                cmd: 'SORT_IMPORTANCE',
        },
        urgency : {
                name: '紧急',
                desc: true,
                cmd: 'SORT_URGENCY',
        },
        difficulty: {
                name: '困难',
                desc: true,
                cmd: 'SORT_DIFFICULTY',
        },
        easy: {
                name: '容易',
                desc: false,
                cmd: 'SORT_DIFFICULTY',
        },
    }

    return (
      <p className='footer-sort'>
        <span style={this.style.showTip }>度量: </span>
        {' '}
        {this.renderSort(relate.importance)}
        {', '}
        {this.renderSort( relate.urgency )}
        {', '}
        {this.renderSort( relate.difficulty )}
        {', '}
        {this.renderSort( relate.easy )}

        { this.renderSortResult(sorts, relate ) }
      </p>
    )
  }

  renderTags() {
      return (
          <div  className="footer-item" id='footer-tags' >
              <span>标签: </span>
              <ImuSelectTags  
                  onChange={ this.handleTagChange.bind(this) } 
                  allTags = { this.props.tags } 
                  selects={ this.props.selectTags }
              />

      </div>
      )
  }

  renderFromfile() {
      const { fromfiles } = this.props
      // 选择文件的需求
      const files = [
          ... fromfiles
      ]
      return (
          <div  className="footer-item" id='footer-fromfile'>
              <span style={this.style.showTip }>源文件: </span>
              <FooterFromfile
                  files={ this.props.fromfiles} 
                  selects={ this.props.selectFiles }
                  actions={ this.props.actions }
              />
          </div>
      )
  }


  renderUndo() {
    return (
      <p>
        <button onClick={this.props.onUndo} disabled={this.props.undoDisabled}>撤销上一步</button>
        <button onClick={this.props.onRedo} disabled={this.props.redoDisabled}>重做</button>
      </p>
    )
  }

  render() {
      const style = this.constructor.style 
      return (
          <div className="footer">
              <FilterText 
                  actions={ this.props.actions } 
                  filter={ this.props.filterText } 
              />
              {this.renderTags()}
              {this.renderFilters()}
              {this.renderSorts()}
              <FilterDate
                  actions={ this.props.actions } 
                  filterDate={ this.props.filterDate } 
              />

              {this.renderFromfile()}

              <FlatButton 
                  label="恢复默认条件" 
                  style={ style.flatButton }
                  onClick={ this.handleInitState }
              />

      </div>
      )
  }
}

        //{this.renderUndo()}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  undoDisabled: PropTypes.bool.isRequired,
  redoDisabled: PropTypes.bool.isRequired,

  actions: PropTypes.object.isRequired,
  fromfiles: React.PropTypes.instanceOf(Immutable.List),
  selectFiles: React.PropTypes.instanceOf(Immutable.List),
  
  selectTags: React.PropTypes.instanceOf(Immutable.List),
  tags: React.PropTypes.instanceOf(Immutable.List),

  sort: React.PropTypes.instanceOf(Immutable.List),
  filterText: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  filterDate: React.PropTypes.instanceOf(Immutable.Map).isRequired,

  filter: PropTypes.oneOf([
    'SHOW_ALL',
    'SHOW_COMPLETED',
    'SHOW_ACTIVE'
  ]).isRequired,
}
Footer.style = {
    flatButton: {
        border: '1px solid white',
        borderRadius: '25px',
        color: 'white' ,
        height: '35px',
    },
}
