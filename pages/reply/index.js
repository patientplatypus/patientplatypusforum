import React, { Component } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Submit from '../../components/Submit'
import Feed from '../../components/Feed';
import NavMenu from '../../components/NavMenu';
import Chat from '../../components/Chat'
import Head from 'next/head'
import '../../styles/root.css'

class Reply extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/forum/getPost"
    console.log('value of url: ', url)
    var postReturn = await axios.post(url, {postID: query.post})
    .then(response=>{
      console.log('value of response: ', response)
      return response.data
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    return({postData: postReturn, postID: query.post})
  }

  state = {
    postData: this.props.postData,
    postID: this.props.postID
  }

  componentDidMount(){
    console.log('inside componentDidMount and value of postData: ', this.state.postData)
  }

  reloadPage = () => {
    console.log("inside reloadPage")
    let url = "http://localhost:5000/forum/getPost"
    axios.post(url, {postID: this.state.postID})
    .then(response=>{
      console.log('value of response: ', response)
      this.setState({
        postData: response.data
      })
    })
    .catch(error=>{
      console.log('error from Node: ', error)
    })
  }

  flipPic = (picVal, picType) => { 
    picVal.data = "" //in order to prevent sending the entire buffer in request
    axios.post('http://localhost:5000/forum/flipPic', {picVal})
    .then(response=>{
      if(picType=='post'){
        let tempPostData = this.state.postData;
        tempPostData.postObj = response.data.picVal;
        this.setState({postData: tempPostData})
      }else if(picType=='comment'){
        let tempArr = this.state.postData.commentArr;
        let indexVal = tempArr.indexOf(tempArr.find((datum)=>{return datum.post == picVal.post}))
        tempArr[indexVal] = response.data.picVal
        let tempPost = this.state.postData;
        tempPost.dataArr = tempArr
        console.log('value of tempPost: ', tempPost)
        this.setState({postData: tempPost})
      }
    })
    .catch(error=>{
      console.log('value of error from /flipPic: ', error)
    })
  }

  picHandler = (picVal, picType) => {
    console.log('value of picVal: ', picVal)
    if(picVal==undefined || picVal == null || picVal == -1){
      return null
    }else{
      return (
        <div
        style={{cursor: 'pointer', height: '100%', width: '100%'}}
        onClick={()=>{this.flipPic(picVal, picType)}}
        >
          <a href={`http://localhost:5000/${picVal.fileName}`} target="_blank" onClick={(e)=>{e.preventDefault()}}>
            <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`} style={{height: '100%', width: '100%'}}/>
          </a>
        </div>
      )
    }
  }


  render(){
    let postPicVal = this.state.postData.postObj == null?-1:this.state.postData.postObj;
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
              Reply
            </div>
          </div>
          <Submit 
          reloadPage={()=>this.reloadPage()}
          submitType={'comment'}
          postID={this.props.postID}
          ></Submit>
          <div className='card' style={{marginBottom: '5px'}}>
            <div style={{display: 'inline-block', marginRight: '5px'}}>
              {this.picHandler(postPicVal, 'post')}
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              {this.state.postData.post.body}
            </div>
            <div style={{width: '100%'}}>
              <div style={{float: 'right', marginRight: '5px'}}>
                Images: {this.state.postData.post.comments.filter(comment=>comment.fileName!='').length}
              </div>
              <div style={{float: 'right', marginRight: '5px'}}>
                Replies: {this.state.postData.post.comments.length}
              </div>
              <div style={{clear: 'both'}}/>
            </div>
          </div>
          <div>
            {this.state.postData.post.comments.map((comment, index)=>{
              let commentPicVal = this.state.postData.commentArr.find((datum)=>{return datum.post == comment._id});
              return(
                <div className='cardComment' key={index} style={{marginBottom: '5px'}}>
                  <div style={{display: 'inline-block', marginRight: '5px'}}>
                    {this.picHandler(commentPicVal, 'comment')}
                  </div>
                  <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                    {comment.body}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='rightContainer'>
          <div style={{height: '10vh', width: '100%', background: ''}}>
            <div className='allWhoCome' style={{display: 'inline-block', height: '8vh', marginTop: '1vh', marginBottom: '1vh', marginLeft: '1vw', lineHeight: '8vh', fontSize:'1.9vw', width: '20vw'}}>
              All Who Come Are Welcome
            </div>
            <img src='/static/hamsa.png' style={{height: '8vh',  maxWidth: '3vw', marginTop: '1vh', marginBottom: '1vh', marginRight: '1vw', float: 'right'}}/>
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

export default Reply