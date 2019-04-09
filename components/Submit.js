
import React, { Component } from 'react'
import renderIf from 'render-if';
// import request from 'request';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import '../styles/root.css'

class Submit extends Component{
  constructor(props){
    super(props)
    this.fileRef = React.createRef();
    this.state = {
      selectedFile: null, 
      textVal: '', 
      errorText: '', 
      captcha: ''
    }
  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    console.log('237498237423847 inside componentDidUpdate for Submit');
    console.log('237498237423847 and value of props: ', this.props)
    if(prevProps.IDclicked!=this.props.IDclicked && !this.state.textVal.includes(this.props.IDclicked)){
      let tempTextVal = this.state.textVal;
      tempTextVal = tempTextVal + ">>"+this.props.IDclicked+">>";
      this.setState({textVal: tempTextVal}, ()=>{
        console.log('237498237423847 after setState and value of textVal in Submit: ', this.state.textVal)
      })
    }
  }

  handlePost = () => {
    console.log('234234234324234234234234242 inside handlePost YODAWG')
    const uploadData = new FormData()
    uploadData.append('pic', this.state.selectedFile)
    uploadData.append('boardType', this.props.boardType)
    uploadData.append('captcha', this.state.captcha)
    if(this.state.textVal==''){
      this.setState({errorText: 'Post text cannot be empty!'})
    }else if(this.state.selectedFile==null){
      this.setState({errorText: 'You must post a picture DAWG'})
    }else if(this.state.selectedFile.size>5000000){
      this.setState({errorText: 'Image size must be less than 5mb!'})
    }else if(this.state.captcha==''){
      this.setState({errorText: 'Please confirm you are not a robot!'})
    }else if(this.props.submitType=='post'){
      uploadData.append('post', this.state.textVal)
      this.setState({textVal: '', errorText: ''}, ()=>{
        axios({
          method: 'post',
          url: process.env.serverADD+'forum/uploadPost',
          data: uploadData,
          config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((response)=>{
          //handle success
          console.log(response);
          this.setState({
            selectedFile: null, 
            textVal: ''
          })
          this.props.reloadPage();
        })
        .catch((response)=>{
          //handle error
          console.log(response);
        });
      })
    }else if(this.props.submitType=='comment'){
      console.log('inside if statement for comment')
      uploadData.append('comment', this.state.textVal)
      uploadData.append('postID', this.props.postID)
      this.setState({textVal: '', errorText: ''}, ()=>{
        axios({
          method: 'post',
          url: 'http://localhost:5000/forum/uploadComment',
          data: uploadData,
          config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((response)=>{
          console.log('inside axios return for submitType comment')
          //handle success
          console.log(response);
          this.setState({
            selectedFile: null, 
            textVal: ''
          })
          this.props.reloadPage();
        })
        .catch((response)=>{
          //handle error
          console.log(response);
        });
      })
    }
  }

  render(){
    const name = this.state.selectedFile==null?null:this.state.selectedFile.name;
    return(
      <div className='submitPostContainer'>
        <textarea
          style={{height: '20vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
          value={this.state.textVal}
          onChange={(e)=>{
            if(e.target.value.length<=2000){
              let numValLeft = 2000 - e.target.value.length
              this.setState({errorText: numValLeft.toString() + " characters remaining"})
            }else if (e.target.value.length > 2000){
              let numValLeft = e.target.value.length - 2000
              this.setState({errorText: numValLeft.toString() + " characters too many"})
            }
            this.setState({textVal: e.target.value})
          }}
        ></textarea>
        <div>
          {renderIf(name!=null)(
            <div style={{fontStyle: 'italic', display: 'inline-block', marginRight: '5px'}}>
              chosen file: {name}
            </div>
          )}
          <input type="file" style={{display: 'none'}}  name="file"  ref={(input)=>this.fileRef = input} onChange={this.handleselectedFile}/>
          <ReCAPTCHA
            sitekey={process.env.recaptchaSiteKey}
            onChange={(e)=>{console.log('value of captcha onchange', e); this.setState({captcha: e})}}
          />
          {renderIf(this.state.errorText!='')(
            <div style={{fontStyle: 'italic', display: 'inline-block', marginLeft: '5px', float: 'left', color: 'rgb(141, 57, 34)', marginTop: '5px'}}>
              {this.state.errorText}
            </div>
          )}
          {renderIf(!this.state.errorText.includes('too many'))(
            <div>
              <div className='button' style={{marginRight: '5px'}} onClick={()=>{this.fileRef.click();}}>
                CHOOSE PIC
              </div>
              <div className='button' onClick={()=>{this.handlePost()}}>
                POST
              </div>
            </div>
          )}
          {renderIf(this.state.errorText.includes('too many'))(
            <div>
              <div className='button' style={{marginRight: '5px', background: 'grey'}}>
                CHOOSE PIC
              </div>
              <div className='button' style={{background: 'grey'}}>
                POST
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Submit
