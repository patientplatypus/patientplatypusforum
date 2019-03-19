import React, { Component } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Submit from '../../components/Submit'
import Feed from '../../components/Feed';
import NavMenu from '../../components/NavMenu';
import Chat from '../../../components/Chat'
import Head from 'next/head'
import '../../styles/root.css'

class Reply extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = "http://localhost:5000/getPost"
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
    let url = "http://localhost:5000/getPost"
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
    axios.post('http://localhost:5000/flipPic', {picVal})
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
          <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`} style={{height: '100%', width: '100%'}}/>
        </div>
      )
    }
  }


  render(){
    let postPicVal = this.state.postData.postObj == null?-1:this.state.postData.postObj;
    return(
      <div className='main'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
        </Head>
        <Feed/>
        <div style={{height: '5vh'}}>
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
        <div className='rightItemContainer'>
          <NavMenu/>
          <Chat/>
        </div>
      </div>
    )
  }
}

export default Reply