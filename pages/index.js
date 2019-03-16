import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Head from '../components/head'
import Nav from '../components/nav'

import axios from 'axios';

import Submit from '../components/Submit'


import renderIf from 'render-if';

import '../styles/root.css'

class Home extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/getNavPage"
    console.log('value of url: ', url)
    console.log('value of query: ', query)
    var postReturn = await axios.post(url, {
      navPage: query.navPage
    })
    .then(response=>{
      // console.log('value of response.data: ', response.data)
      // console.log('value of response.data.dataArr[0].data: ', response.data.dataArr[0].data);
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
      url: 'http://localhost:5000/getNumPages',
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
    Router.push({
      pathname: '/'
    })
  }

  picHandler = (picVal) => {
    if(picVal==undefined){
      return null
    }else{
      return <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`}/>
    }
  }

  navFetch = (navPage) => {
    console.log('inside navFetch and value of navPage: ', navPage)
    Router.push({
      pathname: '/'+navPage
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

  render(){
    return(
      <div className='main' ref={(input)=>this.mainRef = input}>
        <div style={{height: '10vh'}}>
        </div>
        <Submit 
        reloadPage={()=>this.reloadPage()}
        submitType={'post'}
        ></Submit>
        <div>
          {this.state.postData.posts.map((post, index)=>{
            let picVal = this.state.postData.dataArr.find((datum)=>{return datum.post == post._id})
            console.log('value of post.comments.map(comment=>comment.fileName!="")', post.comments.filter(comment=>comment.fileName!='').length)
            return(
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
            )
          })}
        </div>
        <div className='navCard'>
          {this.navHandler()}
        </div>
        <div className='nav'>
          <div style={{fontWeight:'bold', textAlign: 'center', width: '100%'}}>
            Navigation
          </div>
          <div>
            <Link href='/FAQ'><a href=''>FAQ</a></Link>
          </div>
          <div>
            <Link href='/'><a href=''>Forum</a></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
