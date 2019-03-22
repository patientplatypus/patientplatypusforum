import React, { Component } from 'react'
import Link from 'next/link'

import {MainContext} from '../services'

import '../styles/root.css'
import { callbackify } from 'util';

class ChatContext extends Component{
  state = {
    textVal: ' '
  }
  chatRef = React.createRef();

  scrollToBottom = () => {
    console.log('inside scrollToBottom')
    console.log('value of this.chatRef: ', this.chatRef)
    this.chatRef.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount(){
    console.log('inside componentDidMount in ChatContext')
    setTimeout(() => {
      this.scrollToBottom()
    }, 0);
   
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    this.scrollToBottom() //cant get diff between current and prevprops atm, will always scrolltobottom on ANY context change...hmm...
  }

  render(){
    return(
      <div className='chat'>
        <div style={{width: 'calc(100% + 10px)', border: '10px dotted #aa6800', marginTop: '-15px', marginLeft: '-15px', marginBottom: '-15px'}}>
          <div style={{height: '1rem', width: '100%', margin: 'auto', textAlign: 'center', fontWeight: 'bold', marginTop: '5px', marginBottom: '5px'}}>
            Chat
          </div>
          <div style={{height: 'calc(60vh)', background: 'rgb(123, 146, 180)', padding: '5px'}}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', position: 'relative'}}>
              <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', overflowY: 'auto'}}>
                {this.props.context.state.chatArr.map((chatItem, index)=>{
                  return(
                    <div key={index} style={{textAlign: 'left', wordBreak: 'break-all'}}>
                      <span style={{fontWeight: 'bold'}}>{chatItem.usr}:</span>{chatItem.msg}
                    </div>
                  )
                })}
                <div ref={(input)=>this.chatRef = input}/>
              </div>
            </div>
          </div>
          <div style={{width: '100%', background: '#71481b'}}>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <div style={{flex: 1, fontWeight: 'bold', marginLeft: '5px', textAlign: 'left', marginTop: '5px', fontSize: '0.75rem'}}>
                {this.props.context.state.chatName}
              </div>
              <div style={{flex: 2}}>
                <input
                  value={this.state.textVal}
                  onKeyPress={(event)=>{
                    if(event.key=='Enter'){
                      this.props.context.sendChat({usr: this.props.context.state.chatName, msg: this.state.textVal})
                      this.setState({textVal: ''})
                    }
                  }}
                  onChange={(e)=>{this.setState({textVal: e.target.value})}}
                  style={{width: 'calc(100% - 20px)', height: 'calc(100% - 10px)'}}
                >
                </input>
              </div>
            </div>
            <div style={{clear: 'both'}}/>
          </div>
        </div>
      </div>
    )
  }

}

class Chat extends Component{


  render(){
    return(
      <MainContext.Consumer>
        {context => {
          return(
            <ChatContext context={context}/>
          )
        }}
      </MainContext.Consumer>
    )
  }
}

export default Chat