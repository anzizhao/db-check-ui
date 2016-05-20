import React from 'react';
import { Spectacle, Deck } from 'spectacle';
import CodeSlide from 'spectacle-code-slide';

      //<Spectacle theme={theme}>
            //code={ JSON.stringify(this.props.sample) }
export default class Sample extends React.Component {
  render() {
    return (
      <Spectacle >
        <Deck transition={[]} transitionDuration={0} progress="bar">
          <CodeSlide
            transition={[]}
            lang="js"
            code={ "function(){}"}
            ranges={[
              { loc: [0, 270], title: "Walking through some code" },
              { loc: [0, 1], title: "The Beginning" },
              { loc: [1, 2] },
              { loc: [1, 2], note: "Heres a note!" },
              { loc: [2, 3] },
              { loc: [4, 7] },
              { loc: [8, 10] },
            ]}/>
        </Deck>
      </Spectacle>
    );
  }
}

Sample.propTypes = {
    //sample: React.PropTypes.array,
}

