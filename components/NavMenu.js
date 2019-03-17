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
          <Link href='/FAQ'>FAQ</Link>
        </div>
        <div>
          <Link href='/forum/sfw'>SFW Forum</Link>
        </div>
        <div>
          <Link href='/forum/nsfw'>NSFW Forum</Link>
        </div>
      </div>
    )
  }
}

export default NavMenu