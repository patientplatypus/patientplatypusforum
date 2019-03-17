import React, { Component } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Submit from '../../components/Submit'

import NavMenu from '../../components/NavMenu';

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

  picHandler = (picVal) => {
    console.log('value of picVal: ', picVal)
    if(picVal==undefined || picVal == null || picVal == -1){
      return null
    }else{
      return <img src={`${`data:image/`+picVal.extension+`;base64,`+picVal.data}`}/>
    }
  }
  // res.json({post: post, postObj: fileObj, commentArr: commentArr})
  render(){
    let postPicVal = this.state.postData.postObj == null?-1:this.state.postData.postObj;
    return(
      <div className='main'>
        <div style={{height: '10vh'}}>
        </div>
        <Submit 
        reloadPage={()=>this.reloadPage()}
        submitType={'comment'}
        postID={this.props.postID}
        ></Submit>
        <div className='card' style={{marginBottom: '5px'}}>
          <div style={{display: 'inline-block', marginRight: '5px'}}>
            {this.picHandler(postPicVal)}
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
                  {this.picHandler(commentPicVal)}
                </div>
                <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                  {comment.body}
                </div>
              </div>
            )
          })}
        </div>
        <NavMenu/>
      </div>
    )
  }
}

export default Reply