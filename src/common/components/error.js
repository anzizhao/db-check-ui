import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Map } from 'immutable'
import Dialog from 'material-ui/lib/dialog';

export default class Error extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    
    componentWillReceiveProps (nProps) {
        if( nProps.error !== this.props.error )  { 
            //提示
            this.setState({
                open: true 
            })
            
            
            if(! nProps.error.get('options').toJS().notSetTimeout ) {
                // 默认1s 后关闭
                setTimeout(()=>{
                    this.setState({
                        open : false 
                    })
                    const cb = nProps.error.get('cb')
                    if ( cb ) {
                        cb.apply( nProps.error.get('context') || this ) 
                    }
                }, 1000)
            }
        }
    }

    shouldComponentUpdate( nProps, nState ){
        if( this.state.open !== nState.open 
            || nProps.error !== this.props.error )  {
            return true  
        }
        return false 
    }    

    handleClose = () => {
        this.setState({open: false});
    };


    render() {
        const  error = this.props.error.get('error')
        const  msg = this.props.error.get('msg')
        let showMsg  = ''
        if( error ) {
            showMsg = `error: ${error}   `
        }
        showMsg +=  `msg: ${msg}`
        return (  
                <Dialog
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    { showMsg }
                </Dialog>
        )
    }
}

Error.propTypes = {
    error : React.PropTypes.instanceOf(Map),
}

export default Error;
