import Socket from 'socket.io-client';

import React, { Component } from 'react'
import Link from 'next/link'

import '../styles/root.css'

class NavMenu extends Component{
  componentDidMount(){
    const socket = Socket('http://localhost:5000');
    socket.on('connection established', (msg)=>{
      console.log('connection established...', msg)
    })
  }
  state = {}
  render(){
    return(
      <div className='feed'>
       
      </div>
    )
  }
}

export default NavMenu