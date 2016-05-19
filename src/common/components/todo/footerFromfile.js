import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import  Immutable from 'immutable'
import FlatButton from 'material-ui/lib/flat-button';
import { eFilename }  from '../../constants';


export default class FooterFromfile extends Component {
    shouldComponentUpdate (nProps, nState) {
        if ( nProps.files !== this.props.files
             || nProps.selects !== this.props.selects)
        {
            return true 
        }
        return false 
    }

    handleClickFile(file, toSelect) {
       let sf = file
       if ( file.text === eFilename.browser )  {
            sf.text  =  '' 
       }
       this.props.actions.toggleSelectFile( sf , toSelect)  
    }

    render() {
        const { files, selects } = this.props
        const style =  this.constructor.style
        const tagBadges =  
            files.map( ( file ) => {
                let select = selects.find(sf => sf.text === file.text ) ? true : false
                let filename = file.text === '' ? eFilename.browser : file.text 
                const fileButStyle = Object.assign( {}, style.fileBut,  { color: select ?  '#28BAAD' :  '#262626' })
                return (
                    <span 
                        className="tagBadge" 
                        key={ file.id + 1 }
                        style={fileButStyle}
                        onClick={ e => { this.handleClickFile( file, !select)} }
                    > 
                        { filename }
                    </span>
                )
            }) 
        return (
            <div  className="fromfiles">
                {  tagBadges }
            </div>
        ) 
    }
}

FooterFromfile.propTypes = {
    files: React.PropTypes.instanceOf(Immutable.List),
    selects: React.PropTypes.instanceOf(Immutable.List),
    actions: PropTypes.object.isRequired,
}

FooterFromfile.style = {
    fileBut: {
        background:  "whitesmoke" ,
        borderColor: '#262626',
        padding: '.4em .8em .4em .8em',
        borderRadius: '18px',
        cursor: 'pointer',
    },
}

