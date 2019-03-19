import Socket from 'socket.io-client';
import React, { Component } from 'react'
import Ticker from 'react-ticker'
import {MainContext} from '../services';


import '../styles/root.css'

import renderIf from 'render-if'

class NavMenu extends Component{
  render(){
    return(
      <MainContext.Consumer>
        {context => {
          return(
            <div className='feed'>
              <Ticker
              offset="run-in"
              speed={10}
              >
                {({index})=><div className='feedFont' style={{display: 'inline-block', whiteSpace: 'nowrap'}}>{context.state.feedArr}</div>
                }
              </Ticker>
            </div>
          )
        }}
      </MainContext.Consumer>
    )
  }
}

export default NavMenu