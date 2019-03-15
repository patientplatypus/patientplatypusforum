import React, { Component } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import Nav from '../components/nav'

import axios from 'axios';

import Submit from '../components/Submit'

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

  render(){
    return(
      <div className='main'>
        <div style={{height: '10vh'}}>
        </div>
        <Submit></Submit>
        <div>
          {/* {window.btoa(this.props.postData)}
          'data:image/jpeg;base64,' + buf.toString('base64')
          <img src={`${'data:image/jpeg;base64,' + window.btoa(this.props.postData)}`}/>  */}
          {/* <img src={`${"data:image/jpg;base64, " + btoa(this.props.postData.dataArr[0].data.data)}`}/> */}
          {/* {this.props.postData.dataArr[0].data.data} */}
          <img src={`${'data:image/jpeg;base64,'+this.props.postData.dataArr[0].data}`}/>
        </div>
        {/* {this.state.posts.map(post=>{
          return(
            <div key={post._id}>
              {renderIf()()}
              <div style={{display: 'inline-block', marginLeft: '5px', marginRight: '5px'}}>

              </div>
            </div>
          )
        })} */}
        <div className='card'> 
          hello there sailor 
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
