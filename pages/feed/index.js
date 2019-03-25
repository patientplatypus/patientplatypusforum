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
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Germania+One" rel="stylesheet"/> 
        </Head>
        <div className='mainView'>
        <Feed/>
        <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              Feed
            </div>
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
              style={{height: '10vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
              value={this.state.textVal}
              onChange={(e)=>{this.setState({textVal: e.target.value})}}
            ></textarea>
            <div style={{width: '100%', textAlign: 'right'}}>
              <MainContext.Consumer>
              {context => {
                return(
                  <div className='button' style={{}} onClick={()=>{context.sendFeed(this.state.textVal); this.setState({textVal: ''})}}>
                    SEND TO FEED
                  </div>
                )
              }}
              </MainContext.Consumer>
            </div>
          </div>
        </div>
        </div>
        
        <div className='rightContainer'>
          <div style={{height: '10vh', width: '100%', background: ''}}>
            <div className='allWhoCome' style={{display: 'inline-block', height: '8vh', marginTop: '1vh', marginBottom: '1vh', marginLeft: '1vw', lineHeight: '8vh', fontSize:'1.9vw', width: '20vw'}}>
              All Who Come Are Welcome
            </div>
            <img src='/static/hamsa.png' style={{height: '8vh', maxWidth: '3vw', marginTop: '1vh', marginBottom: '1vh', marginRight: '1vw', float: 'right'}}/>
          </div>
          <NavMenu/>
          <Chat/>
        </div>
        <div className='leftContainer'>
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