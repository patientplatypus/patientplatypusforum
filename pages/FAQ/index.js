import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'

class FAQ extends Component{
  state = {
    componentMounted: false
  }
  componentDidMount(){
    this.setState({componentMounted: true})
  }
  render(){
    return(
      <div className='main'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
        </Head>
        <div className='middleView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              FAQ
            </div>
          </div>
          <div className='faq'> 
            <div style={{fontWeight: 'bold'}}>
              Welcome to the FAQ
            </div>
            <br/>
            <div>
              I'm making a forum (obviously), but I have no idea what people want. So I'm just going to make it simple at first. And it's very simple as you can tell. You submit posts and you can reply to the posts that are already submitted. If you have any suggestions please feel free to go to the contact page and email me or make a forum post. Anything goes, so long as it's not illegal. Also try and keep the cancer to the NSFW board. Have fun!
            </div>
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

export default FAQ