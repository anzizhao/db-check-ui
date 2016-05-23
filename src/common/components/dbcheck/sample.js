import React from 'react';
import { PrismCode } from "react-prism";
import { default as jsonFormat} from 'json-format';



      //<Spectacle theme={theme}>
            //code={ JSON.stringify(this.props.sample) }
export default class Sample extends React.Component {
  render() {
    //const codeStr = JSON.stringify( this.props.sample )
    const codeStr = jsonFormat( this.props.sample )

    return (
        <pre>
            <PrismCode className="language-json">
                { codeStr }
            </PrismCode>
        </pre>
    )
  }
}

Sample.propTypes = {
    sample: React.PropTypes.array,
}

