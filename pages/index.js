import React, { Component } from 'react'
import Link from 'next/link'
import '../styles/root.css'

import NavMenu from '../components/NavMenu'
import Head from 'next/head'
import renderIf from 'render-if'
import Feed from '../components/Feed'
import Chat from '../components/Chat'

import '../styles/root.css'

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
          {/* <div style={{height: '5vh', textAlign: 'center', marginBottom: '1vh'}}>

          </div>
          <br/> */}
          <div className='titleFont' style={{fontSize: '4vh', textAlign: 'center'}}>
            Welcome to patientplatypus
          </div>
          <div className=''>  
            <div style={{width: '20vw', marginLeft: '1vw', marginRight: '1vw', display: 'inline-block'}}>
              <img src='/static/hellotheresailor.svg' style={{width: '100%'}}/>
            </div>
            <div className='card' style={{width: 'calc(100% - 24vw)', display: 'inline-block', verticalAlign: 'top'}}>
              <div>
                Hi 👋
              </div>
              <div>
                This is a side project website that I'm working on. It's primarily a web forum with some pretty pictures. Right now it has a chat and blog as well. I'll be adding cool things as I go. Navigation on the top right. Cheers 🍻
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