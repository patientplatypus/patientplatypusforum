import React, { Component } from 'react'
import Link from 'next/link'

import '../styles/root.css'

class NavMenu extends Component{
  state = {}
  render(){
    return(
      <div className='nav'>
        <div style={{width: 'calc(100%)', maxHeight: '30vh', border: '10px dotted #aa6800', marginTop: '-10px', marginLeft: '-10px', marginBottom: '-10px'}}>
            <div style={{fontWeight:'bold', textAlign: 'center', width: '100%', marginTop: '5px', marginBottom: '5px'}}>
              Navigation
            </div>
            <div style={{marginRight: '10px', marginBottom: '5px'}}>
              <div style={{display: 'block'}}>
                <div style={{display: 'inline-block',marginRight: '5px'}}>
                  <Link href='/FAQ'><a href=''>FAQ</a></Link>
                </div>
                <div style={{display: 'inline-block'}}>
                  <Link href='/feed'><a href=''>Feed</a></Link>
                </div>
              </div>
              <div style={{display: 'block'}}>
                <div style={{display: 'inline-block',marginRight: '5px'}}>
                  <Link href='/forum/sfw'><a href=''>SFW Forum</a></Link>
                </div>
                <div style={{display: 'inline-block'}}>
                  <Link href='/forum/nsfw'><a href=''>NSFW Forum</a></Link>
                </div>
              </div>
              <div style={{display: 'block'}}>
                <div style={{display: 'inline-block', marginRight: '5px'}}>
                  <Link href='/blog'><a href=''>Blog</a></Link>
                </div>
                <div style={{display: 'inline-block'}}>
                  <Link href='/admin'><a href=''>Admin</a></Link>
                </div>   
              </div>  
            </div>
          </div>
      </div>
    )
  }
}

export default NavMenu