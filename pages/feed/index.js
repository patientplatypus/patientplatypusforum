import React, { Component } from 'react'
import Link from 'next/link'
import {MainContext} from '../../services';
import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Head from 'next/head'
import renderIf from 'render-if'
import Feed from '../../components/Feed'
import Chat from '../../components/Chat'

import '../../styles/root.css'

class FeedPage extends Component{
  state = {
    textVal: ''
  }
  render(){
    return(
      <div className='main'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
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
          <div> 
            <textarea
              style={{height: '10vh', width: '40vw', marginBottom:'5px'}}
              value={this.state.textVal}
              onChange={(e)=>{this.setState({textVal: e.target.value})}}
            ></textarea>
            <br/>
            <MainContext.Consumer>
            {context => {
              return(
                <div className='button' style={{display: 'inline-block', float: 'right', marginRight: '10vw'}} onClick={()=>{context.sendFeed(this.state.textVal); this.setState({textVal: ''})}}>
                  SEND TO FEED
                  </div>
              )
            }}
            </MainContext.Consumer>
          </div>
        </div>
        <div className='rightItemContainer'>
          <NavMenu/>
          <Chat/>
        </div>
        <div className='leftItemContainer'>
          <div style={{width: '15vw', marginLeft: '2.5vw'}}>
            <img src='/static/patientplatypus777.svg' style={{width: '100%'}}/>
            <div className='titleFont' style={{fontSize: '1.7vw'}}>
              Patient Platypus
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default FeedPage