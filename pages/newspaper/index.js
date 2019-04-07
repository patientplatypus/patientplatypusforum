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

class Newspaper extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/newspaper/getHeadlines"
    var postReturn = await axios.get(url)
    .then(response=>{
      console.log('value of response from getNavPage: ', response.data)
      return response.data.posts
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    return({postData: postReturn})
  }

  state = {
    componentMounted: false,
    textVal: '', 
    notification: '', 
    captcha: '', 
    postData: [],
    editNum: 0,
    captcha: '',
    captchaOK: true,
    editHeadline: this.props.postData[0]!=undefined?this.props.postData[0]['headline']:'Empty', 
    editURL: this.props.postData[0]!=undefined?this.props.postData[0]['url']:'Empty', 
    // notification: ''
    notification: this.props.postData[0]!=undefined?this.props.postData[0]['created']:'', 
    timeDif: 0,
    submitSuccess: false
  }

  componentDidMount(){
    this.setState({componentMounted: true})
    console.log('value of this.props.postData: ', this.props.postData)
    let postData = this.props.postData;
    var postDatalength = postData.length;
    if (postDatalength<10){
      for(var x = 0; x<10-postDatalength; x++){
        postData.push({headline: 'Empty', url: 'Empty'})
      }
    }
    console.log('value of postData before set:', postData)
    this.setState({postData})
    if(this.state.notification!=''){
      console.log('inside displayNotification and value of this.state.notification: ', this.state.notification)
      var notificationDate = new Date(this.state.notification)
      var timeDif = Date.now() - notificationDate - 900000
      this.setState({timeDif})
    }
  }

  submitEdit(){
    if(this.state.captcha==''){
      this.setState({captchaOK: false})
    }else{
      this.setState({captchaOK: true}, ()=>{
        axios.post('http://localhost:5000/newspaper/addHeadline', {
          editNum: this.state.editNum,
          editHeadline: this.state.editHeadline,
          editURL: this.state.editURL,
          captcha: this.state.captcha
        })
        .then(response=>{
          console.log('value of response: ', response)
          let postData = response.data.posts;
          var postDatalength = postData.length;
          if (postDatalength<10){
            for(var x = 0; x<10-postDatalength; x++){
              postData.push({headline: 'Empty', url: 'Empty'})
            }
          }
          this.setState({postData, editNum: 0, editHeadline:  postData[0]!=undefined?postData[0]['headline']:'Empty', editURL: postData[0]!=undefined?postData[0]['url']:'Empty', notification: postData[0]!=undefined?postData[0]['created']:'', submitSuccess: true})
        })
        .catch(error=>{
          console.log('value of error: ', error)
        })
      })
    }
  }

  displayNotification(){
    console.log('inside displayNotification and value of this.state.notification: ', this.state.notification)
    var notificationDate = new Date(this.state.notification)
    var timeDif = Date.now() - notificationDate
    console.log('value of timeDif: ', timeDif-9000)
    console.log('value of notificationDate: ', notificationDate)
    return null;
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
              News
            </div>
          </div>
          <div className='card'> 
            <div style={{fontWeight: 'bold'}}>
              Welcome to the News Page
            </div>
            <br/>
            <div style={{marginBottom: '5px'}}>
              Feel free to change the contents of the community newspaper!
            </div>
          </div>
          <div className='card' style={{marginTop:'2vh'}}>
            <div style={{width: '100%'}}>
              {this.state.postData.map((item, index)=>{
                return(
                  <div key={index} style={{marginLeft: '5%', width: 'calc(90% - 6px)', border: '2px black solid', marginBottom: '4px', padding: '2px'}}>
                    <div>
                      Headline: {item.headline}
                    </div>
                    <div style={{display: 'inline-block'}}>
                      URL: {item.url}
                    </div>
                    {renderIf(this.state.editNum!=index)(
                      <div className='button' style={{display: 'inline-block', float: 'right'}}
                      onClick={()=>{
                        this.setState({editNum: index, editHeadline: item.headline, editURL: item.url})
                      }}
                      >
                        EDIT
                      </div>
                    )}
                    {renderIf(this.state.editNum==index)(
                      <div style={{display: 'inline-block', float: 'right', marginBottom: '-3px', fontSize: '1rem'}}
                      onClick={()=>{
                        this.setState({editNum: index})
                      }}
                      >
                        ✅
                      </div>
                    )}
                    <div style={{clear: 'both'}}/>
                  </div>
                )
              })} 
            </div>
            <div style={{textAlign: 'center'}}>
              <p>
                Please select a news headline from above to edit. You may only edit and submit one new headline. 
              </p>
            </div>
          </div>
          <div className='card' style={{marginTop: '2vh', textAlign: 'left', marginBottom: '10px'}}>
              
            <div style={{marginLeft: '5px', width: '60%'}}>
              Headline: 
            </div>
            <div style={{marginLeft: '5px', width: '60%'}}>
              <input style={{float: 'right', width: '90%'}} 
              value={this.state.editHeadline}
              onChange={(e)=>{this.setState({editHeadline: e.target.value})}}/>
            </div>
            <div style={{clear: 'both'}}/>
            <div style={{marginLeft: '5px', marginTop: '5px',  width: '60%'}}>
              URL:
            </div>
            <div style={{marginLeft: '5px', width: '60%'}}>
              <input style={{float: 'right', width: '90%'}} 
              value={this.state.editURL}
              onChange={(e)=>{this.setState({editURL: e.target.value})}}/>
            </div>
            <div style={{clear: 'both'}}/>
            {renderIf(this.state.timeDif>=0)(
              <div>
                {renderIf(this.state.componentMounted)(
                  <div style={{paddingTop: '10px', marginLeft: '5px'}}>
                    <ReCAPTCHA
                      sitekey={process.env.recaptchaSiteKey}
                      onChange={(e)=>{console.log('value of captcha onchange', e); this.setState({captcha: e})}}
                    />
                  </div>
                )}
                <div className='button' style={{display: 'inline-block', float: 'right'}}
                onClick={()=>{this.submitEdit()}}
                >
                  Submit
                </div>
              </div>
            )}
            {renderIf(!this.state.captchaOK)(
              <div style={{display: 'inline-block', float: 'right', color: 'rgb(141, 57, 34)', marginRight: '5px', marginTop: '5px'}}>
                Please check that you are not a robot.
              </div>
            )}
            {renderIf(this.state.timeDif<0)(
              <div style={{display: 'inline-block', float: 'right', color: 'rgb(141, 57, 34)', marginRight: '5px', marginTop: '5px'}}>
                Newspaper was updated recently. Please wait {Math.round(Math.abs(this.state.timeDif/60000))} minutes to update.
              </div>
            )}
            {renderIf(this.state.submitSuccess)(
              <div style={{display: 'inline-block', float: 'right', color: 'rgb(141, 57, 34)', marginRight: '5px', marginTop: '5px'}}>
                News item successfully submitted. Reload page to see community news sidebar update. Thanks!
              </div>
            )}
            <div style={{clear: 'both'}}/>
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

export default Newspaper