import Socket from 'socket.io-client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

import React, { Component } from 'react'
import Link from 'next/link'
import Ticker from 'react-ticker'

import '../styles/root.css'

import renderIf from 'render-if'

class NavMenu extends Component{

  constructor(props){
    super(props);
    try{
      this.socket =  Socket('http://localhost:5000');
    }catch(e){
      console.log('catch: ', e)
    }
   
    this.state = {
      feedArr: "FEED ʕっ˘ڡ˘ςʔ", 
      componentMounted: false
    }
  }

  componentDidMount(){
    this.socket.on('connection established', (msg)=>{
      console.log('connection established...', msg)
      this.setState({componentMounted: true})
      this.socket.on('feedItem', (msg)=>{
        console.log('feedItem: ', msg)
        let tempArr = this.state.feedArr
        if (tempArr=="FEED"){
          tempArr = "//" + msg
        }else{
          tempArr = tempArr + "//" + msg
        }
        this.setState({
          feedArr: tempArr,
        }, ()=>{
          console.log("after setState and value of feedArr : ", this.state.feedArr)
        })
      })
    })
  }

  render(){
    return(
      <div className='feed'>
        {renderIf(this.state.componentMounted)(
          <Ticker
          offset="run-in"
          speed={10}
          >
            { ({index})=><div className='feedFont' style={{display: 'inline-block', whiteSpace: 'nowrap'}}>{this.state.feedArr}</div>
            }
          </Ticker>
        )}
      </div>
    )
  }
}

export default NavMenu