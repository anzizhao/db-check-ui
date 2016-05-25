import React, { Component, PropTypes } from 'react'
import  Immutable from 'immutable'

import Divider from 'material-ui/Divider';
import List from 'material-ui/List/List';
import FlatButton from 'material-ui/FlatButton/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import Badge from 'material-ui/Badge/Badge';

import Item from './item'

var {exportFile, readFile, stateEqual } = require('../../util')

export default class VList  extends Component {
    constructor(props) {
        super(props);
        this.shouldShowItemNum = 20
        this.timeout = null
        this.state = {
            showItemNum : this.shouldShowItemNum  
        }
    }

    componentWillMount(){
        //根据屏幕大小 算出应该显示多少个
        // per item height 46px 
        this.shouldShowItemNum = Math.floor(  window.screen.height / 48 + 5 )
        this.state.showItemNum = this.shouldShowItemNum 
        this.countShowItems(this.props)
    }

    componentWillReceiveProps( np ){
        if( np.items !== this.props.items  )  {
            NProgress.start();
            this.state.showItemNum = this.shouldShowItemNum 
            //this.countShowItems(np)
        }
    }
    shouldComponentUpdate(np, ns) {
        if( np.items !== this.props.items || 
            ! stateEqual( ns, this.state ) 
          )  {
              console.log('should component update true ')
              return true  
        }
        console.log('should component update false')
        return false 
    }
    componentDidUpdate(pp){
        console.log('component did update')
        this.countShowItems(this.props)
    }

    //计算显示数目
    countShowItems( props ){
        let showItemNum = this.state.showItemNum  
        if( props.items.size <=  showItemNum )  {
            //处理完成
            NProgress.done();
            return  
        }
        let shouldShowItemNum = 2 * this.shouldShowItemNum 
        showItemNum += ( props.items.size - showItemNum  > shouldShowItemNum ) ? 
            shouldShowItemNum : props.items.size 
            
        //防止合并 渲染
        setTimeout( ()=> {
            this.setState({
                showItemNum: showItemNum 
            })
        }, 10)
    }


    getStyle (){
        const style =  this.constructor.style
        //const dStyle = {}
        //return Object.assign({}, style, dStyle) 
        return style 
    } 

    renderBanner (db, style ){
        const viewItemNum = db.size  
        return (
            <div  className="list-banner" >
                <div style={ style.totalInfo } >
                    <span>
                        { `${ viewItemNum }/${this.props.info.number}`}
                    </span>
                </div>

                <div  className="mertic-tips">
                    <span>
                        sql错误=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(243, 8, 8, 1)'}} 
                        />
                        过滤异常=
                        <Badge
                            badgeContent={''}
                            style={ style.badgeContent}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(13, 163, 230, 1 )'}} 
                        />

                        过滤成功=
                        <Badge
                            badgeContent={''}
                            badgeStyle={{...style.badge, 'backgroundColor':'rgba(93, 214, 35, 1)'}} 
                            style={ style.badgeContent}
                        />
                    </span>
                    <br/>
                </div>
            </div>
        )
    }


    render() {
        const { actions, items } = this.props
        const style = this.getStyle() 
        //const db = items.toObject()
        return (           
                <div  className="dbList">
                    { this.renderBanner (items, style  ) }
                    <List  style={style.list}>
                        { 
                            items.filter((item, index)=> index < this.state.showItemNum )
                            .map((item ,index)  => {
                                return (
                                    <Item 
                                        index={ index }
                                        actions={actions}
                                        key={ item.get('uuid') }
                                        item={ item }
                                    />
                                    )
                            })
                        }
                    </List>
                    <Divider inset={true}/>
                </div>
               )
    }
}

VList.propTypes = {
  actions: PropTypes.object.isRequired,
  items: React.PropTypes.instanceOf(Immutable.List),
  info: PropTypes.object.isRequired,
}

VList.style = {
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
    totalInfo: {
        float: 'left',
        fontSize: 13,
        margin: '10px',
        marginLeft: '30px',
        fontWeight: 500,
    }
}
