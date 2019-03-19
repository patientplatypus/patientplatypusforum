
import React, { Component } from "react";
import { MainContext } from "./MainContext";
import Socket from 'socket.io-client';

class Provider extends Component {
  state = {
    feedArr: 'FEED ʕっ˘ڡ˘ςʔ'
  }
  socket = null

  componentDidMount(){
    console.log("inside componentDidMount of Provider")
    console.log('value of socket: ', this.socket)
    if (this.socket == null){
      console.log('inside this.socket = null')
      this.socket = Socket('http://localhost:5000')
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
        setInterval(() => {
          this.socket.emit('heartbeat', 'bump')
        }, 1000);
      })
    }
  }

  render() {
    return (
      <MainContext.Provider
        value={{
          state: this.state,
          sendFeed: (feedStr)=>{
            this.socket.emit('addFeed', feedStr)
          }
        }}
      >
        {this.props.children}
      </MainContext.Provider>
    )
  }

}


export { Provider };