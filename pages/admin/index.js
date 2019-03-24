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

class Admin extends Component{
  state = {
    componentMounted: false, 
    passText: '',
    creatingBlogPost: false,
    updateBlogPost: false,
    passwordVerified: false, 
    archiveArr: {posts:[]},
    displayArr: [], 
    titleText: '', 
    dateText: ''
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

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.updateBlogPost!=this.state.updateBlogPost && this.state.updateBlogPost){
      axios.post('http://localhost:5000/getBlogArchive')
      .then(response=>{
        console.log('value of response from blogArchive: ', response.data)
        this.setState({archiveArr: response.data})
      })
      .catch(error=>{
        console.log('there was an error in getting Blog Archive: ', error)
      })
    }
  }

  handleSubmitBlog = () => {
    let payload = {
      blogArr: this.state.displayArr,
      title: this.state.titleText,
      dateText: this.state.dateText
    }
    axios.post('http://localhost:5000/submitBlogPost', {payload})
    .then(response=>{
      console.log('response from blog post: ', response)
      this.setState({
        displayArr: [], 
        titleText: '',
        dateText: '',
        creatingBlogPost: false
      })
    })
    .catch(error=>{console.log('error on submitting blog post: ', error)})
  }

  handleUpdateBlog = () => {
    console.log('inside handleUpdateBlog')
    let payload = {
      blogArr: this.state.displayArr.map(item=>{
        if(item.type=='file'){
          item.data="";
          return(item)
        }
      }),
      title: this.state.titleText,
      dateText: this.state.dateText
    }
    console.log('value of payload: ', payload)
    axios.post('http://localhost:5000/updateBlogPost', {payload})
    .then(response=>{
      console.log('response from blog post: ', response)
      this.setState({
        displayArr: [], 
        titleText: '',
        dateText: '',
        creatingBlogPost: false, 
        updateBlogPost: false
      })
    })
    .catch(error=>{console.log('error on submitting blog post: ', error)})
  }

  handleGetBlog = (id) => {
    console.log('inside handleGetBlog and id: ', id)
    axios.post('http://localhost:5000/getBlogPost', {navID: id})
    .then(response=>{
      console.log('value of response from getBlogPost, ', response);
      let masterArr = response.data.post.bodyArr.concat(response.data.post.fileArr);
      let sortedMaster = masterArr.sort((a, b)=>{
        console.log('value of a.index: ', a.index, ' value of b.index: ', b.index)
        return a.index - b.index
      })
      console.log('value of sortedMaster: ', sortedMaster);
      this.setState({displayArr: masterArr, creatingBlogPost: true})
    })
    .catch(error=>{
      console.log('value of error from getBlogPost, ', error);
    })
  }

  render(){
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
        </Head>
        <div className='mainView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              Administration
            </div>
          </div>
          <div className='admin'> 
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
                  <div style={{marginTop: '5px'}}>
                    <div className='button'
                      style={{display: 'inline-block'}}
                      onClick={()=>{this.setState({creatingBlogPost: true, updateBlogPost: false, displayArr: []})}}
                    >
                      Create Blog Post
                    </div>
                    <div className='button'
                      style={{display: 'inline-block', marginLeft: '5px'}}
                      onClick={()=>{this.setState({updateBlogPost: true, creatingBlogPost: false, displayArr: []})}}
                    >
                      Update Blog Post
                    </div>
                  </div>
                  {renderIf(this.state.updateBlogPost)(
                    <div style={{border: '5px solid black', width: 'calc(100% - 10px)', marginTop: '5px'}}>
                      <div style={{marginLeft: '5px', marginTop: '5px', fontWeight: 'bold'}}>
                        Select Blog Post To Update
                      </div>
                      <div style={{marginLeft: '5px', marginBottom: '5px'}}>
                        <select style={{minWidth: '20vw'}}
                          onChange={(e)=>{this.handleGetBlog(e.target.value)}}
                        >
                          <option  value="" selected="selected" hidden="hidden">
                            Choose Previous Blog By Title
                          </option>
                          {this.state.archiveArr.posts.map((item, index)=>{
                            return(
                              <option key={index} value={item.id}>
                                {item.title}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                  {renderIf(this.state.creatingBlogPost)(
                    <div style={{border: '5px solid black', width: 'calc(100% - 10px)', marginTop: '5px'}}>
                      <div style={{marginLeft: '5px', marginTop: '5px', fontWeight: 'bold'}}>
                        {renderIf(this.state.updateBlogPost==false)(
                          <div>
                            Let's Create A Blog Post!
                          </div>
                        )}
                        {renderIf(this.state.updateBlogPost)(
                          <div>
                            Select Update Values
                          </div>
                        )}
                      </div>
                      <div style={{marginBottom: '5px', marginLeft: '5px'}}>
                        <span style={{marginRight: '5px'}}>Title:</span>
                        <input
                        value={this.state.titleText}
                        onChange={(e)=>{
                          this.setState({titleText: e.target.value})
                        }}
                        >
                        </input>
                      </div>
                      <div style={{marginBottom: '5px', marginLeft: '5px'}}>
                        <span style={{marginRight: '5px'}}>Date:</span>
                        <input
                        value={this.state.dateText}
                        onChange={(e)=>{
                          this.setState({dateText: e.target.value})
                        }}
                        >
                        </input>
                      </div>
                      <div>
                        {this.state.displayArr.map((disp, index)=>{
                          if(disp.type=='body'){
                            return(
                              <div key={index} style={{width: 'calc(100% - 10px)', marginLeft: '5px', marginRight: '5px'}}>
                                <div style={{marginBottom: '5px'}}>
                                  Enter Paragraph Below
                                </div>
                                <textarea
                                value={disp.value}
                                style={{height: '20vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
                                onChange={(e)=>{
                                  var tempArr = this.state.displayArr;
                                  tempArr[index]['value'] = e.target.value
                                  this.setState({displayArr: tempArr}, ()=>{
                                    console.log('after setting textarea and value of this.state.displayArr: ', this.state.displayArr)
                                  })
                                }}
                                >  
                                </textarea>
                                <div style={{marginBottom: '5px'}}>
                                  <div style={{display: 'inline-block'}} className='button' onClick={()=>{
                                    var tempArr = this.state.displayArr;
                                    let newTemp = tempArr.filter(temp=>{
                                      return temp!=disp
                                    })
                                    console.log('value of tempArr: ', newTemp)
                                    this.setState({displayArr: newTemp}, ()=>{console.log('after setstate and value of displayArr; ', this.state.displayArr)})
                                  }}>
                                    REMOVE
                                  </div>
                                  {renderIf(index!=0)(
                                    <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                      let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                      tempArr[index-1] = this.state.displayArr[index];
                                      tempArr[index] = this.state.displayArr[index-1];
                                      this.setState({displayArr: tempArr}, ()=>this.forceUpdate())
                                    }}>
                                      MOVE UP
                                    </div>
                                  )}
                                  {renderIf(index!=this.state.displayArr.length-1)(
                                    <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                      console.log('value of this.state.displayArr: ',  this.state.displayArr)
                                      let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                      tempArr[index+1] = this.state.displayArr[index];
                                      tempArr[index] = this.state.displayArr[index+1];
                                      console.log('value of tempArr: ', tempArr)
                                      this.setState({displayArr: tempArr})
                                    }}>
                                      MOVE DOWN
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          }else if(disp.type=='picURL'){
                            return(
                              <div key={index} style={{width: 'calc(100% - 10px)', marginLeft: '5px', marginRight: '5px'}}>
                                <div style={{marginBottom: '5px'}}>
                                  Enter Picture URL Below
                                </div>
                                <input
                                value={disp.value}
                                onChange={(e)=>{
                                  var tempArr = this.state.displayArr;
                                  tempArr[index]['value'] = e.target.value
                                  this.setState({displayArr: tempArr})
                                }}
                                >
                                </input>
                                <br style={{marginBottom: '5px'}}/>
                                <div style={{marginBottom: '5px'}}>
                                  Give Your Picture a Name!
                                </div>
                                <input
                                value={disp.name}
                                onChange={(e)=>{
                                  var tempArr = this.state.displayArr;
                                  tempArr[index]['name'] = e.target.value
                                  this.setState({displayArr: tempArr})
                                }}
                                >
                                </input>
                                <br style={{marginBottom: '5px'}}/>
                                <div style={{marginBottom: '5px'}}>
                                  <div className='button' onClick={()=>{
                                    var tempArr = this.state.displayArr;
                                    let newTemp = tempArr.filter(temp=>{
                                      return temp!=disp
                                    })
                                    console.log('value of tempArr: ', newTemp)
                                    this.setState({displayArr: newTemp}, ()=>{console.log('after setstate and value of displayArr; ', this.state.displayArr)})
                                  }}>
                                    REMOVE
                                  </div>
                                  {renderIf(index!=0)(
                                    <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                      let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                      tempArr[index-1] = this.state.displayArr[index];
                                      tempArr[index] = this.state.displayArr[index-1];
                                      this.setState({displayArr: tempArr})
                                    }}>
                                      MOVE UP
                                    </div>
                                  )}
                                  {renderIf(index!=this.state.displayArr.length-1)(
                                    <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                      let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                      tempArr[index+1] = this.state.displayArr[index];
                                      tempArr[index] = this.state.displayArr[index+1];
                                      this.setState({displayArr: tempArr})
                                    }}>
                                      MOVE DOWN
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          }else if(disp.type=='file'){
                            return(
                              <div key={index} style={{marginBottom: '5px'}}>
                                <div style={{marginBottom: '5px', marginLeft: '5px'}}>
                                  Image stored in DB: 
                                </div>
                                <div style={{marginLeft: '5px', marginRight: '5px', width: 'calc(100% - 10px)'}}>
                                  <img src={`${`data:image/`+disp.ext+`;base64,`+disp.data}`} style={{height: '100%', width: '100%'}}/>
                                </div>
                                {renderIf(index!=0)(
                                    <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                      let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                      tempArr[index-1] = this.state.displayArr[index];
                                      tempArr[index] = this.state.displayArr[index-1];
                                      this.setState({displayArr: tempArr}, ()=>this.forceUpdate())
                                    }}>
                                      MOVE UP
                                    </div>
                                  )}
                                {renderIf(index!=this.state.displayArr.length-1)(
                                  <div style={{display: 'inline-block', marginLeft: '5px'}} className='button' onClick={()=>{
                                    console.log('value of this.state.displayArr: ',  this.state.displayArr)
                                    let tempArr = JSON.parse(JSON.stringify(this.state.displayArr));
                                    tempArr[index+1] = this.state.displayArr[index];
                                    tempArr[index] = this.state.displayArr[index+1];
                                    console.log('value of tempArr: ', tempArr)
                                    this.setState({displayArr: tempArr})
                                  }}>
                                    MOVE DOWN
                                  </div>
                                )}
                              </div>
                            )
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
                        style={{float: 'left', marginTop: '5px', marginBottom: '5px'}}
                        onClick={()=>{
                          let tempArr = this.state.displayArr;
                          tempArr.push({type: 'body', value: ''})
                          this.setState({displayArr: tempArr})
                        }}
                        >
                          Append Body
                        </div>
                        {renderIf(this.state.updateBlogPost==false)(
                          <div 
                          className='button'
                          style={{float: 'right', marginTop: '5px', marginBottom: '5px'}}
                          onClick={()=>{
                            this.handleSubmitBlog()
                          }}
                          >
                            Submit
                          </div>
                        )}
                        {renderIf(this.state.updateBlogPost)(
                          <div 
                          className='button'
                          style={{float: 'right', marginTop: '5px', marginBottom: '5px'}}
                          onClick={()=>{
                            this.handleUpdateBlog()
                          }}
                          >
                            Update
                          </div>
                        )}
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
        <div className='rightContainer'>
          <NavMenu/>
          <Chat/>
        </div>
        <div className='leftContainer'>
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

export default Admin