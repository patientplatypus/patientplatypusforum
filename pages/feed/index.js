import React, { Component } from 'react'
import Link from 'next/link'
import Socket from 'socket.io-client';

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Head from 'next/head'
import renderIf from 'render-if'
import Feed from '../../components/Feed'
import Chat from '../../components/Chat'

class FeedPage extends Component{
  constructor(props){
    super(props);
    try{
      this.socket =  Socket('http://localhost:5000');
    }catch(e){
      console.log('catch: ', e)
    }
   
    this.state = {
      textVal: "", 
      componentMounted: false
    }
  }

  componentDidMount(){
    this.socket.on('connection established', (msg)=>{
      this.setState({componentMounted: true})
    })
  }

  handlePost = () => {
    this.socket.emit('addFeed', this.state.textVal)
    this.setState({textVal: ''})
  }

  render(){
    return(
      <div className='main'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
        </Head>
        <Feed/>
        <div style={{height: '5vh'}}>
        </div>
        <div className='feedPage'>
          <div style={{fontWeight: 'bold'}}>
            Welcome to the Feed Inputter
          </div>
          <div>
            Input a phrase or some text to send to the Feed. It will be added to the queue to be displayed in the banner at the top of the page.
          </div>
          <br/>
          {renderIf(this.state.componentMounted)(
            <div> 
              <textarea
                style={{height: '10vh', width: '40vw', marginBottom:'5px'}}
                value={this.state.textVal}
                onChange={(e)=>{this.setState({textVal: e.target.value})}}
              ></textarea>
              <br/>
              <div className='button' style={{display: 'inline-block', float: 'right', marginRight: '10vw'}}onClick={()=>{this.handlePost()}}>
                SEND TO FEED
              </div>
            </div>
          )}
        </div>
        <div className='rightItemContainer'>
          <NavMenu/>
          <Chat/>
        </div>
      </div>
    )
  }
}

export default FeedPage