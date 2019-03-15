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
    let url = "http://localhost:5000/getFirstPage"
    console.log('value of url: ', url)
    var postReturn = await axios.get(url)
    .then(response=>{
      // console.log('value of response.data: ', response.data)
      // console.log('value of response.data.dataArr[0].data: ', response.data.dataArr[0].data);
      return response.data
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    return({postData: postReturn})
  }

  constructor(props){
    super(props)
    this.state = {
      postData: this.props.postData,
      numPages: 1, 
      currentPage: 1,
      posts: [], 
      files: []
    }
    this.mainRef = React.createRef();
  }



  componentDidMount(){
    // console.log('value of this.props.postData: ', this.props.postData.dataArr[0].data)
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
    let url = "http://localhost:5000/getFirstPage"
    console.log('value of url: ', url)
    axios.get(url)
    .then(response=>{
      this.setState({postData: response.data})
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
    })
    .catch(error=>{
      console.log('error from Node: ', error)
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
    console.log('inside navFetch')
    let url = "http://localhost:5000/getNavPage"
    console.log('value of url: ', url)
    axios.post(url, {
      navPage: navPage
    })
    .then(response=>{
      console.log('value of response from getNavPage', response)
      this.setState({
        postData: response.data,
        currentPage: navPage + 1
      },()=>{
        this.mainRef.scrollTop = 0;
      })
    })
    .catch(error=>{
      console.log('value of error from getNavPage: ', error);
    })
  }

  navHandler = () => {
    var navArray = [...Array(this.state.numPages).keys()]
    return(
      navArray.map(navNum=>{
        return(
          <div key={navNum} style={{display: 'inline-block', marginRight: '5px', cursor: 'pointer', fontWeight: this.state.currentPage==navNum+1?'bolder':''}}
          onClick={()=>{this.navFetch(navNum)}}
          >
            {navNum+1}
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
