import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'
import {VerticalCenter} from '../../components/FlexCenter'
import axios from 'axios';

class Blog extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = 'http://localhost:5000/getBlogPost'
    console.log('value of navTitle: ', query.navTitle)
    var postReturn = await axios.post(url, {
      navTitle: query.navTitle==undefined?'N/A':query.navTitle
    })
    .then(response=>{
      console.log('value of response.data: ', response.data)
      return response.data.post
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    console.log('value of postReturn: ', postReturn)
    return({postData: postReturn})
  }
  state = {
    componentMounted: false
  }

  componentDidMount(){
    console.log('component mounted and value of this.props.postData; ', this.props.postData)
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
          <div style={{height: '0vh'}}>
          </div>
          <div className='blogHeader'> 
            <div className='flexContainerRow' style={{height: '20vh', width: '55vw'}}>
              <div style={{flex: 1}}>
                <img src={'/static/deskof.svg'} style={{maxWidth: '100%', maxHeight: '100%'}}/>
              </div>
              <div style={{flex: 2, textAlign: 'center'}}>
                <div className='flexContainerColumn' style={{width: '100%'}}>
                  <div style={{flex: 1}}/>
                  <div style={{flex: 3}}>
                    <div>
                      <span style={{fontWeight: 'bold'}}>Welcome to the Blog</span>
                    </div>
                    <div>
                      I have strong opinions, held loosely, and I often say more than I know.
                    </div>
                    <div>
                      If you're offended, I don't care, go away - the Internet is a big place.
                    </div>
                    <div>
                      The fools have given me a keyboard and a place to write ~ Fear me!
                    </div>
                  </div>
                  <div style={{flex: 1}}/>
                </div>
              </div>
            </div>
            <hr/>
            <hr/>
            <div style={{clear: 'both'}}/>
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

export default Blog