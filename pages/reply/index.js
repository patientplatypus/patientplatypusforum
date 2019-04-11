import React, { Component } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Submit from '../../components/Submit'
import Feed from '../../components/Feed';
import NavMenu from '../../components/NavMenu';
import Chat from '../../components/Chat'
import Head from 'next/head'
import renderIf from 'render-if';
import '../../styles/root.css'
import Welcome from '../../components/Welcome';


import Radio from '../../components/Radio'
import NewsPaper from '../../components/NewsPaper'
import { timingSafeEqual } from 'crypto';

class Reply extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = process.env.serverInitADD+"forum/getPost"
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
    postID: this.props.postID, 
    flagWarning: [],
    componentMounted: false, 
    IDclicked: '', 
    showID: '', 
    x: 0, 
    y: 0
  }

  componentDidMount(){
    console.log('inside componentDidMount and value of postData: ', this.state.postData)
    this.setState({componentMounted: true})
  }

  reloadPage = () => {
    console.log("inside reloadPage")
    let url = process.env.serverADD+"forum/getPost"
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

  picHandler = (picVal, postType) => {
    console.log('value of picVal: ', picVal)
    // console.log('value of this.state.postData in picHandler: ', this.state.postData)
    console.log('hello there picHandler')
    if(picVal==undefined || this.state.postData==undefined){
      return null
    }else{
      return (
        <div
        style={{cursor: 'pointer', height: '100%', width: '100%'}}
        onClick={()=>{
          if(postType=='post'){
            let newTempPostData = this.state.postData;
            if(newTempPostData.post.type=='preview'){
              newTempPostData.post.type = 'actual'
            }else if (newTempPostData.post.type=='actual'){
              newTempPostData.post.type = 'preview'
            }
            this.setState({postData: newTempPostData})
          }else if(postType=='comment'){
            let tempPostData = this.state.postData;
            let newTempPostData = tempPostData
            newTempPostData.post.comments = tempPostData.post.comments.map(item=>{
              if(item._id==picVal.post){
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
            console.log('value of newTempPostData: ', newTempPostData)
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

  handleFlag = (type, post, secondID) => {
    let tempWarning = this.state.flagWarning;
    let url = '';
    let setMsg = '';
    if(type=='post'){
      url = 'http://localhost:5000/forum/flagPost'
    }else if(type=='comment'){
      url = 'http://localhost:5000/forum/flagComment'
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
    console.log('9837249234234 inside renderCommentTagged')
    console.log('9837249234234 value of this.state.x: ', this.state.x)
    console.log('9837249234234 value of this.state.y: ', this.state.y)
    
    if(this.state.postData.post._id==this.state.showID){
      return(
        <div>
          {this.state.postData.post.body}
        </div>
      )
    }else{
      return(
        this.state.postData.post.comments.map(comment=>{
          if(comment._id==this.state.showID){
            return(
              <div>
                {comment.body}
              </div>
            )
          }
        })
      )
    }
  }

  render(){
    let postPicVal = this.state.postData.postObj == null?-1:this.state.postData.postObj;
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Emblema+One|Faster+One|Germania+One|IM+Fell+English|Pacifico|Plaster|Quantico|Quicksand|Share+Tech+Mono|Shrikhand" rel="stylesheet"/>
        </Head>
        {renderIf(this.state.x!=0 && this.state.y!=0 && this.state.showID!="")(
          <div className='card' style={{position: 'absolute', top: `${this.state.y}px`, left: `${this.state.x}px`, zIndex: '99'}}>
            {this.renderCommentTagged()}
          </div>
        )}
        <div className='mainView'>
          <Feed/>
          <div style={{height: '5vh', textAlign: 'center'}}>
            <div className='titleFont' style={{fontSize: '4vh'}}>
              Reply
            </div>
          </div>
          {renderIf(this.state.componentMounted)(
            <Submit 
            reloadPage={()=>this.reloadPage()}
            submitType={'comment'}
            postID={this.props.postID}
            IDclicked={this.state.IDclicked}
            ></Submit>
          )}
          <div className='card' style={{marginBottom: '5px'}}>
            <div style={{display: 'inline-block', marginRight: '5px'}}>
              {this.picHandler({post: this.state.postData.post._id, fileName: this.state.postData.post.fileName, type: this.state.postData.post.type}, 'post')}
            </div>
            <div style={{display: 'inline-block', verticalAlign: 'top'}}>
              <div style={{fontStyle: 'italic'}}
              onClick={()=>{
                this.setState({IDclicked: this.state.postData.post._id})
              }}
              >
                ID: <span style={{textDecoration: 'underline', cursor: 'pointer'}}>{this.state.postData.post._id}</span>
              </div>
              <div style={{fontStyle: 'italic'}}>
                {this.state.postData.post.created}
              </div>
              {this.state.postData.post.body}
            </div>
            <div style={{width: '100%', display: 'inline-block', marginBottom: '5px'}}>
              {renderIf(this.state.postData.post.imageBanned==false)(
                <div style={{float: 'left', marginLeft: '5px', marginRight: '5px'}}>
                  <div className='button'
                    onClick={(e)=>{
                      e.preventDefault()
                      this.handleFlag('post', this.state.postData.post, null)
                    }}
                  >
                    FLAG
                  </div>
                </div>
              )}
              {renderIf(this.state.flagWarning.filter(warn=>warn.id==this.state.postData.post._id)[0]!=undefined)(
                <div style={{color: 'rgb(141, 57, 34)'}}>
                  {this.state.flagWarning.filter(warn=>warn.id==this.state.postData.post._id)[0]!=undefined?this.state.flagWarning.filter(warn=>warn.id==this.state.postData.post._id)[0].msg:''}
                </div>
              )}
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
              return(
                <div className='cardComment' key={index} style={{marginBottom: '5px'}}>
                  <div style={{display: 'inline-block', marginRight: '5px'}}>
                    {this.picHandler({post: comment._id, parentID: this.state.postData.post._id, fileName: comment.fileName, type: comment.type}, 'comment')}
                  </div>
                  <div style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <div style={{fontStyle: 'italic'}}
                    onClick={()=>{
                      this.setState({IDclicked: comment._id})
                    }}
                    >
                      ID: <span style={{textDecoration: 'underline', cursor: 'pointer'}}>{comment._id}</span>
                    </div>
                    <div style={{fontStyle: 'italic'}}>
                      {comment.created}
                    </div>
                    {this.parseCommentBody(comment.body)}
                    {/* {comment.body} */}
                  </div>
                  <div style={{width: '100%', display: 'inline-block', marginBottom: '5px'}}>
                    {renderIf(comment.imageBanned==false)(
                      <div style={{float: 'left', marginLeft: '5px', marginRight: '5px'}}>
                        <div className='button'
                          onClick={(e)=>{
                            e.preventDefault()
                            this.handleFlag('comment', comment, this.state.postData.post._id)
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
            })}
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

export default Reply