import React, { Component } from 'react'
import Link from 'next/link'
import {MainContext} from '../../services';
import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Head from 'next/head'
import renderIf from 'render-if'
import Feed from '../../components/Feed'
import Chat from '../../components/Chat'

import '../../styles/root.css'

import Welcome from '../../components/Welcome';


import Radio from '../../components/Radio'
import NewsPaper from '../../components/NewsPaper'

class FeedPage extends Component{
  state = {
    textVal: '', 
    charCount: 0
  }
  render(){
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Emblema+One|Faster+One|Germania+One|IM+Fell+English|Pacifico|Plaster|Quantico|Quicksand|Share+Tech+Mono|Shrikhand" rel="stylesheet"/>
        </Head>
        <div className='mainView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
              <div className='titleFont' style={{fontSize: '4vh'}}>
                Feed
              </div>
            </div>
          <div className='feedPage'>
            <div style={{fontWeight: 'bold'}}>
              Welcome to the Feed Inputter
            </div>
            <div>
              Input a phrase or some text to send to the Feed. It will be added to the queue to be displayed in the banner at the top of the page.
            </div>
            <br/>
            <div> 
              <textarea
                style={{height: '10vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
                value={this.state.textVal}
                onChange={(e)=>{this.setState({textVal: e.target.value, charCount: e.target.value.length})}}
              ></textarea>
              {renderIf(this.state.charCount>0 && this.state.charCount<200)(
                <div style={{display: 'inline-block', float: 'left', color: 'rgb(141, 57, 34)'}}>
                  Characters Remaining: {200 - this.state.charCount}
                </div>
              )}
              {renderIf(this.state.charCount>200)(
                <div style={{display: 'inline-block',float: 'left', color: 'rgb(141, 57, 34)'}}>
                  Characters Over: <span style={{fontWeight: 'bold'}}>{this.state.charCount - 200}</span>
                </div>
              )}
              <div style={{width: '100%', textAlign: 'right'}}>
                <MainContext.Consumer>
                {context => {
                  return(
                    <div className='button' style={this.state.charCount>200?{background: 'grey', cursor: 'not-allowed'}:{}} onClick={()=>{
                      if(this.state.charCount<=200){
                        context.sendFeed(this.state.textVal); this.setState({textVal: ''})
                      }
                    }}>
                      SEND TO FEED
                    </div>
                  )
                }}
                </MainContext.Consumer>
              </div>
            </div>
          </div>
        </div>
        
        <div className='houndstooth rightContainer checkOrange'>
          <div style={{height: '100%', width: '100%', position: "absolute", overflow: 'hidden', top: 0, left: 0, zIndex: 2}}>
            <Welcome/>
            <NavMenu/>
            <Chat/>
          </div>
          <div style={{height: '100%', width: '100%', position: "absolute", overflow: 'hidden', top: 0, left: 0, zIndex: 1}}>
            <div style={{position: 'relative', height: '100%', width: '100%'}}>
              <div className='establishedText' style={{position: 'absolute', bottom: '4vh', fontSize: '4vw', left: '2vw', color: 'rgb(47, 29, 10)', opacity: 0.8}}>
                ESTABLISHED
              </div>
              <div className='establishedNumber' style={{position: 'absolute', bottom: '1vh', right: 0, fontSize: '4vw', color: 'rgb(47, 100, 10)', opacity: 0.9, marginTop: 'calc(-2vw - 20px)'}}>
                1986
              </div>
            </div>
          </div>
        </div>
        <div className='leftContainer'>
          <div style={{width: '15vw', marginLeft: '2.5vw'}}>
            <img src='/static/patientplatypus777.svg' style={{width: '100%'}}/>
            <div className='titleFont' style={{fontSize: '1.7vw'}}>
              Patient Platypus
            </div>
          </div>
          <div style={{marginTop: '2vh'}}>
            <Radio/>
          </div>
          <div style={{marginTop: '14vh'}}>
            <NewsPaper/>
          </div>
        </div>
      </div>
    )
  }
}

export default FeedPage