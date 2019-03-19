import React, { Component } from 'react'
import Link from 'next/link'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'
class FAQ extends Component{
  state = {}
  render(){
    return(
      <div className='main'>
        <div style={{height: '10vh'}}>
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
        <div className='rightItemContainer'>
          <NavMenu/>
          <Chat/>
        </div>
      </div>
    )
  }
}

export default FAQ