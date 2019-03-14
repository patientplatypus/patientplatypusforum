import React, { Component } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

import Submit from '../components/Submit'

import '../styles/root.css'

class Home extends Component{
  state = {}
  render(){
    return(
      <div className='main'>
        <div style={{height: '10vh'}}>
        </div>
        <Submit></Submit>
        <div className='card'> 
          hello there sailor 
        </div>
        <div className='nav'>
          <div style={{fontWeight:'bold', textAlign: 'center', width: '100%'}}>
            Navigation
          </div>
          <div>
            <Link href='/FAQ'>FAQ</Link>
          </div>
          <div>
            <Link href='/'>Forum</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
