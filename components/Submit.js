
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
      textVal: null
    }
  }

  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  handlePost = () => {
    console.log('inside handlePost')
    const uploadData = new FormData()
    uploadData.append('pic', this.state.selectedFile)
    uploadData.append('post', this.state.textVal)

    for (let [key, value] of uploadData.entries()) { 
      console.log(key, value);
    }

    axios({
      method: 'post',
      url: 'http://localhost:5000/uploadPost',
      data: uploadData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
      })
      .then(function (response) {
          //handle success
          console.log(response);
      })
      .catch(function (response) {
          //handle error
          console.log(response);
      });

  }

  render(){
    const name = this.state.selectedFile==null?null:this.state.selectedFile.name;
    return(
      <div className='submitPostContainer'>
        <textarea
          style={{height: '20vh', width: '40vw', marginBottom:'5px'}}
          onChange={(e)=>{this.setState({textVal: e.target.value})}}
        ></textarea>
        <div>
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
