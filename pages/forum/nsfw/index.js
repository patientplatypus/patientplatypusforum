import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'

import axios from 'axios';

import Submit from '../../../components/Submit'
import NavMenu from '../../../components/NavMenu'
import Feed from '../../../components/Feed';

import renderIf from 'render-if';

import Head from 'next/head'

import '../../../styles/root.css'

class Home extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/getNavPage"
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
      files: []
    }
    this.mainRef = React.createRef();
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: 'http://localhost:5000/getNumPages/nsfw',
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

  reloadPage = () => {
    console.log('inside reloadPosts')
    window.location.href='http://localhost:3000/forum/nsfw/'+this.state.currentPage
  }

  flipPic = (picVal) => { 
    picVal.data = "" //in order to prevent sending the entire buffer in request
    axios.post('http://localhost:5000/flipPic', {picVal})
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
        onClick={()=>{this.flipPic(picVal)}}
        >
          <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`} style={{height: '100%', width: '100%'}}/>
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

  render(){
    return(
      <div className='main' ref={(input)=>this.mainRef = input}>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
        </Head>
        <Feed/>
        <div style={{height: '5vh'}}>
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
                    <div className='button' style={{float: 'right'}}
                    onClick={()=>{
                      Router.push({
                        pathname: '/reply',
                        query: { post: post._id }
                      })
                    }}
                    >
                      REPLY
                    </div>
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
        <NavMenu/>
      </div>
    )
  }
}

export default Home
