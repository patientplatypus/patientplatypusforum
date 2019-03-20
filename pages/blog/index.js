import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'

class Blog extends Component{
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
        </Head>
        <Feed/>
        <div style={{height: '5vh'}}>
        </div>
        <div className='blog'> 
          <img src={'/static/deskof.svg'} style={{width: '30vw', position: 'fixed', top: '5vh', left: '15vw'}}/>
          <div style={{marginLeft: '20vw', fontWeight: 'bold'}}>
            <h1>
              The Great and Majestic Blog
            </h1>
            <h2>
              All Things Under the Sun and Then Some
            </h2>
          </div>
        </div>
        <div className='rightItemContainer'>
          <NavMenu/>
          <Chat/>
        </div>
        <div className='leftItemContainer'>
          <div style={{width: '15vw', marginLeft: '2.5vw'}}>
            <img src='/static/patientplatypus777.svg' style={{width: '100%'}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Blog