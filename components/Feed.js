import Socket from 'socket.io-client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6

import React, { Component } from 'react'
import Link from 'next/link'
import Ticker from 'react-ticker'

import '../styles/root.css'

import renderIf from 'render-if'

class Feed extends Component{

  constructor(props){
    super(props);
    this.socket = null;
    this.state = {
      feedArr: "FEED ʕっ˘ڡ˘ςʔ", 
      componentMounted: false
    }
  }

  componentDidMount(){
    try{
      console.log("29323452345234523452345 IN TRY FOR FEED")
      this.socket =  Socket(process.env.socketADD);
      console.log('29323452345234523452345 IN FEED and value of this.socket: ', this.socket)
      this.socket.on('connect', function() {
        console.log('SOCKET HAS CONNECTED')
        // console.log('29323452345234523452345 check 2', this.socket.connected);
      });
      this.socket.on('connection established', (msg)=>{
        console.log('29323452345234523452345 connection established...IN FEED', msg)
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
    }catch(e){
      console.log('29323452345234523452345 CATCH IN FEED: ', e)
    }
  }

  render(){
    return(
      <div className='feed' >
        {renderIf(this.state.componentMounted)(
          <Ticker
          offset="run-in"
          speed={5}
          >
            { ({index})=><div className='feedFont' style={{display: 'inline-block', whiteSpace: 'nowrap'}}>{this.state.feedArr}</div>
            }
          </Ticker>
        )}
      </div>
    )
  }
}

export default Feed