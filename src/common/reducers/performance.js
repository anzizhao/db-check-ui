
import * as  actions   from '../actions/performance';
import {fromJS} from 'immutable';
import  reactPerf  from 'react-addons-perf';


const performanceInitState = {
    running: false,
} 


export default function performance (state = fromJS( performanceInitState ) , action) {
  switch (action.type) {
      case actions.PERFORMANCE_START:
          reactPerf.start() 
          state = state.set('running', true)
          break

      case actions.PERFORMANCE_END:
          if( state.get('running') ) {
              reactPerf.stop()
              state = state.set('running', false)
              const measurements = reactPerf.getLastMeasurements()
              reactPerf.printWasted(measurements)
          }
          break

      //default:
  }
  return state;
}
