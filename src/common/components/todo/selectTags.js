import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import 'react-select2-wrapper/css/select2.min.css';
import Select2 from 'react-select2-wrapper';

export default class SelectTags extends Component {
    render() {
        const style =  this.constructor.style
        const { onChange, allTags ,select, selectOne } = this.props
        let multiple  
        let options    = {}
        if (! this.props.disableTag ) {
            options = {
                placeholder: '添加或选择标签',
                tags: true,
            }
        }

        let _select, _tags, arr    
        multiple = ! this.props.singleSelect

        if (  multiple ){
            _select  = []
            select.forEach(item => {
                let result = allTags.find(tag =>  item.text === tag.text ) 
                if ( result ) {
                    _select.push  ( result.id )
                }
            })
        } else {
            let result = allTags.find(tag =>  selectOne === tag.text ) 
            if ( result ) {
                _select = result.id
            }
        }

        return (
                <div className="select-tag">
                    <Select2
                        style={style.selectTag}
                        multiple =  { multiple } 
                        defaultValue={ _select }
                        data={ allTags }
                        onChange={ onChange }
                        options={options}
                    />
                </div>
)
    }
}

SelectTags.propTypes = {
    onChange: PropTypes.func.isRequired,
    disableTag: PropTypes.bool,
    allTags: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
    })).isRequired,
    singleSelect: PropTypes.bool,
    selectOne: PropTypes.string,
    select: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.isRequired,
        text: PropTypes.string.isRequired,
    }))
}

SelectTags.style = {
    selectTag:{
        width: "100%" ,
    } 
}

