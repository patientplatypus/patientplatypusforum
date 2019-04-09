
import React, { Component } from "react";
import { MainContext } from "./MainContext";
import Socket from 'socket.io-client';
import axios from 'axios';

class Provider extends Component {
  state = {
    feedArr: '~FEED ʕっ˘ڡ˘ςʔ', 
    chatArr: [],
    chatName: 'anonyMouse', 
    dummy: Date.now(), 
    stations:[{url:""}],
    play: false, 
    channelNum: 0, 
    stationName: 'HELLO THIS IS RADIO'
  }
  socket = null

  componentDidMount(){
    console.log("inside componentDidMount of Provider")
    console.log('value of socket: ', this.socket)
    if (this.socket == null){
      console.log('inside this.socket = null')
      this.socket = Socket(process.env.serverADD)
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
        this.socket.on('chatItem', (payload)=>{
          let tempChatArr = this.state.chatArr;
          tempChatArr.push(payload)
          this.setState({chatArr: tempChatArr}, ()=>{
            console.log('after setting and value of chatArr: ', this.state.chatArr)
          })
        })
        setInterval(() => {
          this.socket.emit('heartbeat', 'bump')
        }, 1000);
      })
    }
    axios.get('https://ipapi.co/json/')
    .then(response=>{
      console.log('response from ipapi: ', response)
      axios.post(process.env.serverADD+'chat/getChatName', {ip: response.data.ip})
      .then(response=>{console.log('response from getChatName', response)
        this.setState({chatName: response.data.chatName})
      })
      .catch(error=>{console.log('error from getChatName', error)})
    })
    .catch(error=>{
      console.log('there was an error in getting your ip: ', error)
    })
    axios.get('http://www.radio-browser.info/webservice/json/stations/topclick/10')
    .then(response=>{
      console.log('response from radio-browser: ', response)
      this.setState({stations: response.data})
    })
    .catch(error=>{
      console.log('there was an errr from radio-browswer: ', error)
    })
  }

  render() {
    return (
      <MainContext.Provider
        value={{
          state: this.state,
          setState: (keyName, value) =>{
            console.log('inside setState for Provider and Key: ', keyName, ' and value: ', value)
            var tempState = this.state;
            tempState[keyName] = value; 
            this.setState({state: tempState})
          },
          sendChat: (payload)=>{
            console.log('inside sendChat')
            this.socket.emit('addChat', payload)
          },
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