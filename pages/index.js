import React, { Component } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

import '../styles/root.css'

class Home extends Component{
  state = {}
  render(){
    return(
      <div className='main'>
        <div className='card'> 
          hello there sailor 
        </div>
      </div>
    )
  }
}

export default Home
