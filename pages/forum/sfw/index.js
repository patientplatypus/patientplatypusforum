import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'

import axios from 'axios';

import Submit from '../../../components/Submit'
import NavMenu from '../../../components/NavMenu'
import Chat from '../../../components/Chat'
import Feed from '../../../components/Feed';
import Head from 'next/head'

import renderIf from 'render-if';
import Welcome from '../../../components/Welcome';
import '../../../styles/root.css'


import Radio from '../../../components/Radio'
import NewsPaper from '../../../components/NewsPaper'

class Home extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    if(req){
      let url = process.env.webserverback+"forum/getNavPage"
      console.log('value of url: ', url)
      console.log('value of query: ', query)
      var postReturn = await axios.post(url, {
        navPage: query.navPage==undefined?0:query.navPage, 
        boardType: 'sfw'
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
      showID: '', 
      x: 0, 
      y: 0
    }
    this.mainRef = React.createRef();
  }

  componentDidMount(){
    axios({
      method: 'get',
      url: process.env.serverfrontADD+'/forum/getNumPages/sfw',
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
    window.location.href=process.env.clientADD+'forum/sfw/'+this.state.currentPage
  }

  picHandler = (picVal, postType) => {
    console.log('value of picVal: ', picVal)
    // console.log('value of this.state.postData in picHandler: ', this.state.postData)
    if(picVal==undefined || this.state.postData==undefined){
      return null
    }else{
      return (
        <div
        style={{cursor: 'pointer', height: '100%', width: '100%'}}
        onClick={()=>{
          let tempPostData = this.state.postData
          let newTempPostData = this.state.postData
          if(postType=='post'){
            newTempPostData.posts = tempPostData.posts.map((item, index)=>{
              if (item._id==picVal.post){
                if(item.type=='preview'){
                  item.type = 'actual'
                  return item
                }else if(item.type=='actual'){
                  item.type = 'preview'
                  return item
                }
              }else{
                return item
              }
            })
            this.setState({postData: newTempPostData})
          }else if(postType=='comment'){
            let parentPost = tempPostData.posts.filter((item)=>{return item._id==picVal.parentID})
            let newCommentData = parentPost[0].comments.map((item, index)=>{
              if (item._id==picVal.post){
                if(item.type=='preview'){
                  item.type = 'actual'
                  return item
                }else if(item.type=='actual'){
                  item.type = 'preview'
                  return item
                }
              }else{
                return item
              }
            })
            newTempPostData.posts = tempPostData.posts.map((item, index)=>{
              if(item._id==picVal.parentID){
                item.comments = newCommentData;
                return item
              }else{
                return item
              }
            })
            this.setState({postData: newTempPostData})
          }
        }}
        >
          <a href={`${process.env.serverStatic}${picVal.fileName}`} target="_blank" onClick={(e)=>{e.preventDefault()}}>
            {renderIf(picVal.type=='preview')(
              <img src={`${process.env.serverStatic}sharp/`+picVal.fileName} style={{maxWidth: '100%'}}/>
            )}
            {renderIf(picVal.type=='actual')(
              <img src={`${process.env.serverStatic}`+picVal.fileName}  style={{maxWidth: '100%'}}/>
            )}
          </a>
        </div>
      )
    }
  }

  navFetch = (navPage) => {
    console.log('inside navFetch and value of navPage: ', navPage)
    Router.push({
      pathname: '/forum/sfw/'+navPage
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
        return(
          <div className='cardComment' key={index} style={{marginBottom: '5px'}}>
            <div 
            style={{display: 'inline-block', marginRight: '5px'}}
            >
              {this.picHandler({post: comment._id, parentID: post._id, fileName: comment.fileName, type: comment.type}, 'comment')}
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <div style={{fontStyle: 'italic'}}>
                ID: <span style={{textDecoration: 'underline', cursor: 'pointer'}}>{comment._id}</span>
              </div>
              <div style={{fontStyle: 'italic'}}>
                {comment.created}
              </div>
              {this.parseCommentBody(comment.body)}
            </div>
            <div style={{width: '100%', display: 'inline-block', marginBottom: '5px'}}>
              {renderIf(comment.imageBanned==false)(
                <div style={{float: 'left', marginLeft: '5px', marginRight: '5px'}}>
                  <div className='button'
                    onClick={(e)=>{
                      e.preventDefault()
                      this.handleFlag('comment', comment, post._id)
                    }}
                  >   
                    FLAG
                  </div>
                </div>
              )}
              {renderIf(this.state.flagWarning.filter(warn=>warn.id==comment._id)[0]!=undefined)(
                <div style={{color: 'rgb(141, 57, 34)'}}>
                  {this.state.flagWarning.filter(warn=>warn.id==comment._id)[0]!=undefined?this.state.flagWarning.filter(warn=>warn.id==comment._id)[0].msg:''}
                </div>
              )}
            </div>
          </div>
        )
      })
    )
  }

  handleFlag = (type, post, secondID) => {
    let tempWarning = this.state.flagWarning;
    let url = '';
    let setMsg = '';
    if(type=='post'){
      url = process.env.serverfrontADD+'/forum/flagPost'
    }else if(type=='comment'){
      url = process.env.serverfrontADD+'/forum/flagComment'
    }
    axios.post(url, {id: post._id, secondID: secondID})
    .then(response=>{
      console.log('value of response.data: ', response.data)
      if(response.data.status=='wait'){
        setMsg = 'Post has recently been posted or flagged. Please wait a few moments.'
      }else if(response.data.status=='success'){
        setMsg = 'Flagged!'
      }else if(response.data.status=='deleted'){
        setMsg = 'Image has been deleted. Refresh page to hide picture.'
      }

      let tempIndex = tempWarning.indexOf(tempWarning.filter(warn=>warn.id==post._id)[0])
      if(tempIndex==-1){
        tempWarning.push({id: post._id, msg: setMsg})
      }else{
        tempWarning[tempIndex].msg = setMsg
      }

      this.setState({flagWarning: tempWarning}, ()=>{
        console.log('after setState and value of flagWarning: ', this.state.flagWarning)
      })

    })
  }

  _onMouseMove(e, item) {
    console.log('9837249234234 value of e.screenX in _onMouseMove', e.screenX)
    this.setState({ x: e.pageX, y: e.pageY, showID: item });
  }

  parseCommentBody(commentBody){
    console.log('234234234235623462346 inside parseCommentBody')
    // var result = commentBody.match(/(?<="<<"\s+).*?(?=\s+">>")/gs); 
    var result = commentBody.match(new RegExp(">>" + "(.*)" + ">>"));
    console.log('234234234235623462346 value of result from parseCommentBody: ', result)
    if(result!=null && result!=undefined){
      return(
        <div>
          {
            commentBody.split(">>").map((item, index)=>{
              if(result[1].includes(item)){
                return(
                  <div onMouseMove={(e)=>this._onMouseMove(e, item)} onMouseLeave={()=>{this.setState({x: 0, y: 0, showID: ''})}} style={{fontStyle: 'italic', display: 'inline-block', marginLeft: '5px', marginRight: '5px', cursor: 'pointer'}}>
                    {item}
                  </div>
                )
              }else{
                return(
                  <div style={{display: 'inline-block'}}>
                    {item}
                  </div>
                )
              }
            })
          }
        </div>
      )
    }else{
      return commentBody;
    }
  }

  renderCommentTagged(){
    return(
      this.state.postData.posts.map((post, index)=>{
        if(post._id==this.state.showID){
          return(
            <div className='card' style={{position: 'absolute', top: `${this.state.y}px`, left: `${this.state.x}px`, zIndex: '99'}}>
              {post.body}
            </div>
          )
        }else{
          return(
            post.comments.map((comment, index)=>{
              if(comment._id==this.state.showID){
                return(
                  <div className='card' style={{position: 'absolute', top: `${this.state.y}px`, left: `${this.state.x}px`, zIndex: '99'}}>
                    {comment.body}
                  </div>
                )
              }
            })
          )
        }
      })
    )
  }

  render(){
    return(
      <div className='gridContainer' ref={(input)=>this.mainRef = input}>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Emblema+One|Faster+One|Germania+One|IM+Fell+English|Pacifico|Plaster|Quantico|Quicksand|Share+Tech+Mono|Shrikhand" rel="stylesheet"/>
        </Head>
        {renderIf(this.state.x!=0 && this.state.y!=0 && this.state.showID!="")(
          <div>
            {this.renderCommentTagged()}
          </div>
        )}
        <div className='mainView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              SFW Forum
            </div>
          </div>
          <Submit 
          reloadPage={()=>this.reloadPage()}
          submitType={'post'}
          boardType={'sfw'}
          ></Submit>
          <div>
            {this.state.postData.posts.map((post, index)=>{
              return(
                <div>
                  <div className='card' key={index} style={{marginBottom: '5px'}}>
                    <div>
                      <div style={{display: 'inline-block', marginRight: '5px'}}>
                      {this.picHandler({post: post._id, fileName: post.fileName, type: post.type}, 'post')}
                      </div>
                      <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                        <div style={{fontStyle: 'italic'}}>
                          ID: <span style={{textDecoration: 'underline', cursor: 'pointer'}}>{post._id}</span>
                        </div>
                        <div style={{fontStyle: 'italic'}}>
                          {post.created}
                        </div>
                        {post.body}
                      </div>
                    </div>
                    <div style={{width: '100%', display: 'inline-block', marginBottom: '5px'}}>
                      {renderIf(post.imageBanned==false)(
                        <div style={{float: 'left', marginLeft: '5px', marginRight: '5px'}}>
                          <div className='button'
                            onClick={(e)=>{
                              e.preventDefault()
                              this.handleFlag('post', post, null)
                            }}
                          >
                            FLAG
                          </div>
                        </div>
                      )}
                      {renderIf(this.state.flagWarning.filter(warn=>warn.id==post._id)[0]!=undefined)(
                        <div style={{color: 'rgb(141, 57, 34)'}}>
                          {this.state.flagWarning.filter(warn=>warn.id==post._id)[0]!=undefined?this.state.flagWarning.filter(warn=>warn.id==post._id)[0].msg:''}
                        </div>
                      )}
                    </div>
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
        <div className='houndstooth rightContainer checkOrange'>
          <div style={{height: '100%', width: '100%', position: "absolute", overflow: 'hidden', top: 0, left: 0, zIndex: 2}}>
            <Welcome/>
            <NavMenu/>
            <Chat/>
          </div>
          <div style={{height: '100%', width: '100%', position: "absolute", overflow: 'hidden', top: 0, left: 0, zIndex: 1}}>
            <div style={{position: 'relative', height: '100%', width: '100%'}}>
              <div className='establishedText' style={{position: 'absolute', bottom: '4vh', fontSize: '4vw', left: '2vw', color: 'rgb(47, 29, 10)', opacity: 0.8}}>
                ESTABLISHED
              </div>
              <div className='establishedNumber' style={{position: 'absolute', bottom: '1vh', right: 0, fontSize: '4vw', color: 'rgb(47, 100, 10)', opacity: 0.9, marginTop: 'calc(-2vw - 20px)'}}>
                1986
              </div>
            </div>
          </div>
        </div>
        <div className='leftContainer'>
          <div style={{width: '15vw', marginLeft: '2.5vw'}}>
            <div className='grad' style={{position: 'absolute', top: '0', left: '5%', width: '90%', height: '40vh', backgroundRepeat: 'no-repeat', maskImage: 'url("/static/comiclines.png")', maskSize: 'cover', maskRepeat: 'no-repeat', WebkitMaskSize: 'cover', WebkitMaskRepeat: 'no-repeat', WebkitMaskImage:'url("/static/comiclines.png")', zIndex: '1'}}
            >
            </div>
            <div style={{position: 'absolute', top: 0, left: '5%', width: '90%', height: '40vh', zIndex: '2'}}>
              <img src='/static/patientplatypus777.svg' style={{height: '100%', maxHeight: '100%', maxWidth: '90%', marginLeft: '5%', marginRight: '5%'}}/>
            </div>
            <div style={{width: '100%', height: '40vh', background: 'black', padding: 0, margin: 0}}>
            </div>
            <div className='titleFont' style={{fontSize: '1.7vw'}}>
              Patient Platypus
            </div>
          </div>
          <div style={{marginTop: '2vh'}}>
            <Radio/>
          </div>
          <div style={{marginTop: '14vh'}}>
            <NewsPaper/>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
