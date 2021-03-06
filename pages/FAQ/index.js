import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import axios from 'axios'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'
import Welcome from '../../components/Welcome';


import Radio from '../../components/Radio'
import NewsPaper from '../../components/NewsPaper'

import ReCAPTCHA from "react-google-recaptcha";

class FAQ extends Component{
  state = {
    componentMounted: false,
    textVal: '', 
    notification: '', 
    captcha: ''
  }
  componentDidMount(){
    this.setState({componentMounted: true})
  }

  handleSubmit = () => {
    console.log('inside handlesubmit')
    if(this.state.captcha!=''){
      this.setState({notification: 'sending...'}, ()=>{
        axios.post(process.env.serverADD+'contact', {emailText: this.state.textVal, captcha: this.state.captcha})
        .then(response=>{
          console.log('value of response.data: ', response.data)
          if(response.data.status=='success'){
            this.setState({textVal: '', notification: 'Email Sent!'})
          }else if(response.data.status=='error'){
            this.setState({notification:'Error Sending Email, Please Try Later'})
          }
        })
        .catch(error=>{
          this.setState({notification:'Error Sending Email, Please Try Later'})
        })
      })
    }else{
      this.setState({notification: 'please provide a successful captcha'})
    }
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
              FAQ
            </div>
          </div>
          <div className='faq'> 
            <div style={{fontWeight: 'bold'}}>
              Welcome to the FAQ
            </div>
            <br/>
            <div style={{marginBottom: '5px'}}>
              I'm making a forum (obviously). You submit posts and you can reply to the posts that are already submitted. Anything goes, so long as it's not illegal. Also try and keep the NSFW to the NSFW board. If you have any suggestions please feel free to use the provided contact field here - it will email me directly. Each post has a flag button that will delete the picture in the post if enough flags are hit, but if you would like a post to be deleted sooner, please use the provided form to email me. I will need the image name, the post ID, and your reasoning for deletion. Thank you and have fun!
            </div>
            <textarea
              style={{height: '20vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
              value={this.state.textVal}
              onChange={(e)=>{this.setState({textVal: e.target.value})}}
            ></textarea>
            <ReCAPTCHA
              sitekey={process.env.recaptchaSiteKey}
              onChange={(e)=>{console.log('value of captcha onchange', e); this.setState({captcha: e})}}
            />
            <div style={{width: '100%', textAlign: 'right'}}>
              {renderIf(this.state.notification!='')(
                <div style={{display: 'inline-block', color: 'rgb(141, 57, 34)', marginRight: '5px'}}>
                  {this.state.notification}
                </div>
              )}
              <div className='button'
              onClick={()=>{this.handleSubmit()}}
              >
                SUBMIT
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
            <div className='grad' style={{position: 'absolute', top: '0', left: '5%', width: '90%', height: '40vh', backgroundRepeat: 'no-repeat', maskImage: 'url("/static/comiclines.png")', maskSize: 'cover', maskRepeat: 'no-repeat', WebkitMaskSize: 'cover', WebkitMaskRepeat: 'no-repeat', WebkitMaskImage:'url("/static/comiclines.png")', zIndex: '1'}}
            >
            </div>
            <div style={{position: 'absolute', top: 0, left: '5%', width: '90%', height: '40vh', zIndex: '2'}}>
              <img src='/static/patientplatypus777.svg' style={{height: '100%', maxHeight: '100%', maxWidth: '90%', marginLeft: '5%', marginRight: '5%'}}/>
            </div>
            <div style={{width: '100%', height: '40vh', background: 'black', padding: 0, margin: 0}}>
            </div>
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

export default FAQ