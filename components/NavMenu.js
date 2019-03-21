import React, { Component } from 'react'
import Link from 'next/link'

import '../styles/root.css'

class NavMenu extends Component{
  state = {}
  render(){
    return(
      <div className='nav'>
        <div style={{fontWeight:'bold', textAlign: 'center', width: '100%'}}>
          Navigation
        </div>
        <div>
          <Link href='/FAQ'><a href=''>FAQ</a></Link>
        </div>
        <div>
          <Link href='/forum/sfw'><a href=''>SFW Forum</a></Link>
        </div>
        <div>
          <Link href='/forum/nsfw'><a href=''>NSFW Forum</a></Link>
        </div>
        <div>
          <Link href='/feed'><a href=''>Feed</a></Link>
        </div>
        <div>
          <Link href='/blog'><a href=''>Blog</a></Link>
        </div>
        <div>
          <Link href='/admin'><a href=''>Admin</a></Link>
        </div>
      </div>
    )
  }
}

export default NavMenu