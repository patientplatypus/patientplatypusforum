import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import '../../styles/root.css'

import axios from 'axios'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'

class FAQ extends Component{
  state = {
    componentMounted: false, 
    passText: '',
    creatingBlogPost: false,
    passwordVerified: false, 
    displayArr: [] 
  }
  componentDidMount(){
    this.setState({componentMounted: true})
  }

  handlePassSubmit = () => {
    axios.get('https://ipapi.co/json/')
    .then(response=>{
      var payload = {
        ip: response.data.ip,
        pass: this.state.passText
      }
      axios.post('http://localhost:5000/confirmPass', {payload})
      .then(response=>{
        console.log('value from confirmPass; ', response.data)
        this.setState({
          passwordVerified: response.data.confirmed
        })
      })
      .catch(error=>{
        console.log('there was an error: ', error);
      })
    })
    .catch(error=>{
      console.log('there was an error retrieving ip : ', error);
    })
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
          <div style={{height: '5vh'}}>
          </div>
          <div className='faq'> 
            <div style={{fontWeight: 'bold'}}>
              Welcome to the Admin Page
            </div>
            <br/>
            {renderIf(this.state.passwordVerified==false)(
              <div>
                <div>
                  To Continue Please Enter The Password
                </div>
                <input
                  value={this.state.passText}
                  onChange={(e)=>{this.setState({passText: e.target.value})}}
                  style={{marginRight: '5px'}}
                ></input>
                <div className='button'
                  onClick={()=>{this.handlePassSubmit()}}
                >
                  SUBMIT
                </div>
              </div>
            )}
            {renderIf(this.state.passwordVerified==true)(
              <div>
                Welcome Admin!
                <div>
                  <div className='button'
                    style={{marginTop: '5px'}}
                    onClick={()=>{this.setState({creatingBlogPost: true})}}
                  >
                    Create Blog Post
                  </div>
                  {renderIf(this.state.creatingBlogPost)(
                    <div style={{border: '5px solid black', width: 'calc(100% - 10px)', marginTop: '5px'}}>
                      <div style={{marginLeft: '5px', marginTop: '5px', fontWeight: 'bold'}}>
                        Let's Create A Blog Post!
                      </div>
                      <div>
                        {this.state.displayArr.map((disp, index)=>{
                          if(disp.type=='body'){
                            return(
                              <div key={index}>
                                <div style={{marginBottom: '5px'}}>
                                  Enter Paragraph Below
                                </div>
                                <textarea
                                style={{height: '20vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
                                onChange={(e)=>{
                                  var tempArr = this.state.displayArr;
                                  tempArr[index]['value'] = e.target.value
                                  this.setState({displayArr: tempArr})
                                }}
                                >  
                                </textarea>
                              </div>
                            )
                          }else if(disp.type=='picURL'){
                            return(
                              <div key={index}>
                              </div>
                            )
                          }else if(disp.type=='picFILE'){
                            return(null)//implment later if need be - not sure worth it atm
                          }
                        })}
                      </div>
                      <div style={{width: 'calc(100% - 25px)', border: '2px solid black', marginTop: '5px', marginBottom: '5px', marginLeft: '5px', marginRight: '5px', paddingLeft: '5px', paddingRight: '5px'}}>
                        <div 
                        className='button'
                        style={{float: 'left', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}
                        onClick={()=>{
                          let tempArr = this.state.displayArr;
                          tempArr.push({type: 'picURL', value: ''})
                          this.setState({displayArr: tempArr})
                        }}
                        >
                          Append Pic (URL)
                        </div>
                        <div 
                        className='button'
                        style={{float: 'left', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}
                        onClick={()=>{
                          let tempArr = this.state.displayArr;
                          tempArr.push({type: 'picFILE', value: ''})
                          this.setState({displayArr: tempArr})
                        }}
                        >
                          Append Pic (FILE)
                        </div>
                        <div 
                        className='button'
                        style={{float: 'left', marginTop: '5px', marginBottom: '5px'}}
                        onClick={()=>{
                          let tempArr = this.state.displayArr;
                          tempArr.push({type: 'body', value: ''})
                          this.setState({displayArr: tempArr})
                        }}
                        >
                          Append Body
                        </div>
                        <div 
                        className='button'
                        style={{float: 'right', marginTop: '5px', marginBottom: '5px'}}>
                          Submit
                        </div>
                        <div 
                        className='button'
                        style={{float: 'right', marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}
                          onClick={()=>{this.setState({creatingBlogPost: false})}}
                        >
                          Cancel
                        </div>
                        <div style={{clear: 'both'}}/>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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

export default FAQ