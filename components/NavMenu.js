import React, { Component } from 'react'
import Link from 'next/link'

import '../styles/root.css'

class NavMenu extends Component{
  state = {}
  render(){
    return(
      <div className='nav'>
        <div style={{display: 'block', width: '100%', border: '10px dotted #aa6800', marginTop: '-10px', marginLeft: '-10px', marginBottom: '-10px', position: 'relative'}}>
            <img src='/static/flower1.png' style={{position: 'absolute', top: '0', left: '15%', height: '90%', maxWidth: '40%', opacity: '0.3', transform: 'rotate(22deg)'}}/>
            <img src='/static/flower2.png' style={{position: 'absolute', top: '0', left: '55%', height: '90%', maxWidth: '40%', opacity: '0.2',  transform: 'rotate(37deg)'}}/>
            <img src='/static/flower3.png' style={{position: 'absolute', top: '0', left: '35%', height: '90%', maxWidth: '40%', zIndex: '1', opacity: '0.2'}}/>
            <div style={{opacity: 0}}>
              <div className='titleFont' style={{fontWeight:'bold', textAlign: 'center', width: '100%', marginTop: '5px', marginBottom: '5px'}}>
                navigation
              </div>
              <div style={{marginRight: '10px', marginBottom: '5px'}}>
                <div style={{display: 'block'}}>
                  <div style={{display: 'inline-block',marginRight: '5px'}}>
                    <a href=''>FAQ</a>
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <a href=''>Feed</a>
                  </div>
                </div>
                <div style={{display: 'block'}}>
                  <div style={{display: 'inline-block',marginRight: '5px'}}>
                    <a href=''>SFW Forum</a>
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <a href=''>NSFW Forum</a>
                  </div>
                </div>
                <div style={{display: 'block'}}>
                  <div style={{display: 'inline-block', marginRight: '5px'}}>
                    <a href=''>Newspaper</a>
                  </div>
                  <div style={{display: 'inline-block', marginRight: '5px'}}>
                    <a href=''>Blog</a>
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <a href=''>Admin</a>
                  </div>   
                </div>  
              </div>
            </div>
            <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: '2'}}>
              <div className='titleFont' style={{fontWeight:'bold', textAlign: 'center', width: '100%', marginTop: '5px', marginBottom: '5px'}}>
                navigation
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
                    <a href={"http://localhost:80/forum/sfw"}>SFW Forum</a>
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <a href={"http://localhost:80/forum/nsfw"}>NSFW Forum</a>
                  </div>
                </div>
                <div style={{display: 'block'}}>
                <div style={{display: 'inline-block', marginRight: '5px'}}>
                    {/* <Link href='/newspaper'><a href={""}>Newspaper</a></Link> */}
                    <a href={"http://localhost:80/newspaper"}>Newspaper</a>
                  </div>
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
      </div>
    )
  }
}

export default NavMenu