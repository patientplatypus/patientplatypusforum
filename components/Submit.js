
import React, { Component } from 'react'
import renderIf from 'render-if';
// import request from 'request';
import axios from 'axios';

import '../styles/root.css'

class Submit extends Component{
  constructor(props){
    super(props)
    this.fileRef = React.createRef();
    this.state = {
      selectedFile: null, 
      textVal: '', 
      errorText: ''
    }
  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  handlePost = () => {
    console.log('234234234324234234234234242 inside handlePost YODAWG')
    const uploadData = new FormData()
    uploadData.append('pic', this.state.selectedFile)
    uploadData.append('boardType', this.props.boardType)

    if(this.state.textVal==''){
      this.setState({errorText: 'Post text cannot be empty!'})
    }else if(this.state.selectedFile=='null'){
      this.setState({errorText: 'You must post a picture DAWG'})
    }else if(this.state.selectedFile.size>5000000){
      this.setState({errorText: 'Image size must be less than 5mb!'})
    }else{
      if(this.props.submitType=='post'){
        uploadData.append('post', this.state.textVal)

        axios({
          method: 'post',
          url: 'http://localhost:5000/forum/uploadPost',
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
      }else if(this.props.submitType=='comment'){
        console.log('inside if statement for comment')
        uploadData.append('comment', this.state.textVal)
        uploadData.append('postID', this.props.postID)
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
      }
    }
  }

  render(){
    const name = this.state.selectedFile==null?null:this.state.selectedFile.name;
    return(
      <div className='submitPostContainer'>
        <textarea
          style={{height: '20vh', width: 'calc(100% - 5px)', marginBottom:'5px'}}
          value={this.state.textVal}
          onChange={(e)=>{this.setState({textVal: e.target.value})}}
        ></textarea>
        <div>
          {renderIf(this.state.errorText!='')(
            <div style={{fontStyle: 'italic', display: 'inline-block', marginLeft: '5px', float: 'left', color: 'rgb(141, 57, 34)'}}>
              {this.state.errorText}
            </div>
          )}
          {renderIf(name!=null)(
            <div style={{fontStyle: 'italic', display: 'inline-block', marginRight: '5px'}}>
              chosen file: {name}
            </div>
          )}
          <input type="file" style={{display: 'none'}}  name="file"  ref={(input)=>this.fileRef = input} onChange={this.handleselectedFile}/>
          <div className='button' style={{marginRight: '5px'}} onClick={()=>{this.fileRef.click();}}>
            CHOOSE PIC
          </div>
          <div className='button' onClick={()=>{this.handlePost()}}>
            POST
          </div>
        </div>
      </div>
    )
  }
}

export default Submit
