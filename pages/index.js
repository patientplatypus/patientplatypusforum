import React, { Component } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

import axios from 'axios';

import Submit from '../components/Submit'

import renderIf from 'render-if';

import '../styles/root.css'

class Home extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    if(req){
      let url = "http://localhost:5000/getFirstPage"
      console.log('value of url: ', url)
      var postReturn = await axios.get(url)
      .then(response=>{
        console.log('value of response.data: ', response.data)
        console.log('value of response.data.dataArr[0].data: ', response.data.dataArr[0].data);
        return response.data
      })
      .catch(error=>{
        console.log('error from Node: ', error)
        return({})
      })
    }
    return({postData: postReturn})
  }

  state = {
    postData: this.props.postData,
    numPages: 1, 
    posts: [], 
    files: []
  }

  componentDidMount(){
    console.log('value of this.props.postData: ', this.props.postData.dataArr[0].data)
    axios({
      method: 'get',
      url: 'http://localhost:5000/getNumPages',
      })
      .then((response)=>{
        //handle success
        console.log(response);
        console.log('value of this.state: ', this.state);
        this.setState({numPages: response.data.numPages})
      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  }

  reloadPosts = () => {
    console.log('inside reloadPosts')
    let url = "http://localhost:5000/getFirstPage"
    console.log('value of url: ', url)
    axios.get(url)
    .then(response=>{
      this.setState({postData: response.data})
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

  render(){
    return(
      <div className='main'>
        <div style={{height: '10vh'}}>
        </div>
        <Submit reloadPosts={()=>this.reloadPosts()}></Submit>
        <div>
          {this.state.postData.posts.map((post, index)=>{
            let picVal = this.state.postData.dataArr.find((datum)=>{return datum.post == post._id})
            return(
              <div className='card' key={index} style={{marginBottom: '5px'}}>
                <div style={{display: 'inline-block', marginRight: '5px'}}>
                  {this.picHandler(picVal)}
                </div>
                <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                  {post.body}
                </div>
              </div>
            )
          })}
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
