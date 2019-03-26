import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'

import axios from 'axios';

import Submit from '../../../components/Submit'
import NavMenu from '../../../components/NavMenu'
import Feed from '../../../components/Feed';
import Chat from '../../../components/Chat'
import renderIf from 'render-if';

import Head from 'next/head'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import '../../../styles/root.css'

class Home extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/forum/getNavPage"
    console.log('value of url: ', url)
    console.log('value of query: ', query)
    var postReturn = await axios.post(url, {
      navPage: query.navPage, 
      boardType: 'nsfw'
    })
    .then(response=>{
      return response.data
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    return({postData: postReturn, currentPage: query.navPage})
  }

  constructor(props){
    super(props)
    this.state = {
      postData: this.props.postData,
      numPages: 1, 
      currentPage: this.props.currentPage==undefined?0:this.props.currentPage,
      posts: [], 
      files: [], 
      flagWarning: [],
    }
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: 'http://localhost:5000/forum/getNumPages/nsfw',
    })
    .then((response)=>{
      //handle success
      console.log(response);
      console.log('value of this.state: ', this.state);
      this.setState({numPages: response.data.numPages}, ()=>{
        console.log('value of getNumPages after assignment: ', this.state.numPages)
      })
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    // console.log('value of window.pageYOffset: ', window.pageYOffset)
    // if(prevState != this.state){
    //   window.pageYOffset = 0
    // }  
  }

  reloadPage = () => {
    console.log('inside reloadPosts')
    window.location.href='http://localhost:3000/forum/nsfw/'+this.state.currentPage
  }

  flipPic = (picVal) => { 
    picVal.data = "" //in order to prevent sending the entire buffer in request
    axios.post('http://localhost:5000/forum/flipPic', {picVal})
    .then(response=>{
      let tempArr = this.state.postData.dataArr;
      let indexVal = tempArr.indexOf(tempArr.find((datum)=>{return datum.post == picVal.post}))
      tempArr[indexVal] = response.data.picVal
      let tempPost = this.state.postData;
      tempPost.dataArr = tempArr
      console.log('value of tempPost: ', tempPost)
      this.setState({postData: tempPost})
    })
    .catch(error=>{
      console.log('value of error from /flipPic: ', error)
    })
  }

  picHandler = (picVal) => {
    if(picVal==undefined){
      return null
    }else{
      return (
        <div
        style={{cursor: 'pointer', height: '100%', width: '100%'}}
        onClick={()=>{
          if(picVal.fileName!='gross.svg'&&picVal.fileName!='noimageavailable.jpg'){
            this.flipPic(picVal)
          }
        }}
        >
          <a href={`http://localhost:5000/${picVal.fileName}`} target="_blank" onClick={(e)=>{e.preventDefault()}}>
            <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`} style={{height: '100%', width: '100%'}}/>
          </a>
        </div>
      )
    }
  }

  navFetch = (navPage) => {
    console.log('inside navFetch and value of navPage: ', navPage)
    Router.push({
      pathname: '/forum/nsfw/'+navPage
    })
  }

  navHandler = () => {
    var navArray = [...Array(this.state.numPages).keys()]
    return(
      navArray.map(navNum=>{
        return(
          <div key={navNum} style={{display: 'inline-block', marginRight: '5px', cursor: 'pointer', fontWeight: this.state.currentPage==navNum?'bolder':''}}
          onClick={()=>{this.navFetch(navNum)}}
          >
            {navNum}
          </div>
        )
      })
    )
  }

  handleCommentPreview = (post) => {
    if(post.comments.length >= 3){
      var lastThreeComments = post.comments.slice(Math.max(post.comments.length - 3, 1))
    }else{
      var lastThreeComments = post.comments
    }
    return(
      lastThreeComments.map((comment, index)=>{
        let commentPicVal = this.state.postData.dataArr.find((datum)=>{return datum.post == comment._id});
        return(
          <div className='cardComment' key={index} style={{marginBottom: '5px'}}>
            <div style={{display: 'inline-block', marginRight: '5px'}}>
              {this.picHandler(commentPicVal)}
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              {comment.body}
            </div>
          </div>
        )
      })
    )
  }

  handleFlag = (type, index, post) => {
    console.log('inside handleFlag')
    console.log('value of post: ', new Date(post.lastFlag).getTime())
    let timeDif = new Date().getTime()-new Date(post.lastFlag).getTime();
    console.log('value of timeDif: ', timeDif);
    if(timeDif<300000){
      console.log('inside if statement')
      var tempWarning = this.state.flagWarning;
      if (tempWarning.indexOf(post._id) == -1){
        tempWarning.push(post._id)
        this.setState({flagWarning: tempWarning}, ()=>{
          console.log('after setstate and value of flagwarning: ', this.state.flagWarning)
        })
      }
    }else{
      var tempWarning = this.state.flagWarning;
      let flagIndex = tempWarning.indexOf(post._id);
      if (flagIndex > -1) {
        tempWarning.splice(flagIndex, 1);
      }
      this.setState({flagWarning: tempWarning}, ()=>{
        let url = '';
        if(type=='post'){
          url = 'http://localhost:5000/forum/flagPost'
        }else if(type=='comment'){
          url = 'http://localhost:5000/flagComment'
        }
        axios.post(url, {id: post._id})
        .then(response=>{
          console.log('value of response: ', response)
          if(response.data.status=='success'){
            let tempPostData = this.state.postData
            console.log('value of tempPostData')
            tempPostData.posts[index].flags = tempPostData.posts[index].flags + 1
            tempPostData.posts[index].lastFlag = Date.now()
            this.setState({postData: tempPostData}, ()=>{
              console.log('after setState and value of postData: ', this.state.postData)
            })
          }
        })
        .catch(error=>{
          console.log('value of error: ', error)
        })
      })
    }
  }

  render(){
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Germania+One" rel="stylesheet"/> 
        </Head>
        <div className='mainView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              NSFW Forum
            </div>
          </div>
          <Submit 
          reloadPage={()=>this.reloadPage()}
          submitType={'post'}
          boardType={'nsfw'}
          ></Submit>
          <div>
            {this.state.postData.posts.map((post, index)=>{
              let picVal = this.state.postData.dataArr.find((datum)=>{return datum.post == post._id})
              console.log('value of post.comments.map(comment=>comment.fileName!="")', post.comments.filter(comment=>comment.fileName!='').length)
              return(
                <div>
                  <div className='card' key={index} style={{marginBottom: '5px'}}>
                    <div>
                      <div style={{display: 'inline-block', marginRight: '5px'}}>
                        {this.picHandler(picVal)}
                      </div>
                      <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                        {post.body}
                      </div>
                    </div>
                    <div style={{width: '100%'}}>
                      <div style={{float: 'left'}}>
                        Flags: {post.flags}
                      </div>
                      <div style={{float: 'left', marginLeft: '5px', marginRight: '5px'}}>
                        <div className='button'
                          onClick={(e)=>{
                            e.preventDefault()
                            this.handleFlag('post', index, post)
                          }}
                        >
                          FLAG
                        </div>
                      </div>
                      {renderIf(this.state.flagWarning.includes(post._id))(
                        <div style={{fontSize: '1vw', color: 'rgb(141, 57, 34)'}}>
                          Post has recently been posted or flagged. Please wait a few moments.
                        </div>
                      )}
                      {renderIf(!this.state.flagWarning.includes(post._id))(
                        <div style={{fontSize: '1vw', color: 'transparent'}}>
                        Post has recently been posted or flagged. Please wait a few moments.
                        </div>
                      )}
                    </div>
                    <br/>
                    <div style={{width: '100%'}}>
                      <a className='button' style={{color: 'black', float: 'right', textDecoration: 'none'}} href={`/reply?post=${post._id}`}>
                        REPLY
                      </a>
                      <div style={{float: 'right', marginRight: '5px'}}>
                        Images: {post.comments.filter(comment=>comment.fileName!='').length}
                      </div>
                      <div style={{float: 'right', marginRight: '5px'}}>
                        Replies: {post.comments.length}
                      </div>
                      <div style={{clear: 'both'}}/>
                    </div>
                  </div>
                  {this.handleCommentPreview(post)}
                </div>
              )
            })}
          </div>
          <div className='navCard'>
            {this.navHandler()}
          </div>
        </div>
        <div className='rightContainer'>
          <div style={{height: '10vh', width: '100%', background: ''}}>
            <div className='allWhoCome' style={{display: 'inline-block', height: '8vh', marginTop: '1vh', marginBottom: '1vh', marginLeft: '1vw', lineHeight: '8vh', fontSize:'1.9vw', width: '20vw'}}>
              All Who Come Are Welcome
            </div>
            <img src='/static/hamsa.png' style={{height: '8vh', maxWidth: '3vw', marginTop: '1vh', marginBottom: '1vh', marginRight: '1vw', float: 'right'}}/>
          </div>
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

export default Home
