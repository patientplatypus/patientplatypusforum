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
      feedArr: "ʕっ˘ڡ˘ςʔ FEED", 
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
      // setTimeout(() => {
      //   this.socket.emit('addFeed', 'hello there sailor yohoho and a bottle of rum')
      // }, 2000);
      // setTimeout(() => {
      //   this.socket.emit('addFeed', 'yolobitches')
      // }, 2000);
    })
  }

  render(){
    return(
      <div className='feed' style={{width: '40vw', marginLeft: '20vw', marginTop: '2vw', background: 'black', color: 'white', fontSize: '30pt', overflow: 'hidden'}}>
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

{/* <div className='feedFont' style={{display: 'inline-block', whiteSpace: 'nowrap', width: 'max-content', float: 'left', transition: 'transform 2s', transitionTimingFunction: 'linear', transform: `translateX(${this.state.transition}px)`}}> */}

{/* <ReactCSSTransitionGroup
style={{display: 'inline-block', whiteSpace: 'nowrap'}}
transitionName="example"
transitionEnterTimeout={500}
transitionLeaveTimeout={300}>
  {items}
</ReactCSSTransitionGroup> */}