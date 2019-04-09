import React, { Component } from 'react'
import {MainContext} from '../../services'
import Link from 'next/link'

import Feed from '../../components/Feed'
import Head from 'next/head'
import renderIf from 'render-if'

import '../../styles/root.css'

import NavMenu from '../../components/NavMenu'
import Chat from '../../components/Chat'
import {VerticalCenter} from '../../components/FlexCenter'
import axios from 'axios';

import Welcome from '../../components/Welcome';


import Radio from '../../components/Radio'
import NewsPaper from '../../components/NewsPaper'

class Blog extends Component{
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    let url = process.env.serverAdd+'blog/getBlogPost'
    console.log('value of navTitle: ', query.navID)
    var postReturn = await axios.post(url, {
      navID: query.navID==undefined?'N/A':query.navID
    })
    .then(response=>{
      console.log('value of response.data: ', response.data)
      return response.data.post
    })
    .catch(error=>{
      console.log('error from Node: ', error)
      return({})
    })
    console.log('value of postReturn: ', postReturn)
    return({postData: postReturn})
  }
  state = {
    componentMounted: false, 
    displayArr: [], 
    masterArr: []
  }

  componentDidMount(){
    console.log('component mounted and value of this.props.postData; ', this.props.postData)
    if(this.props.postData!={} && this.props.postData.fileArr!=undefined){
      let masterArr = this.props.postData.fileArr.concat(this.props.postData.bodyArr);
      let sortedMaster = masterArr.sort((a, b)=>{
        console.log('value of a.index: ', a.index, ' value of b.index: ', b.index)
        return a.index - b.index
      })
      console.log('value of sortedMaster: ', sortedMaster);
      this.setState({componentMounted: true, masterArr: sortedMaster})
    }else{
      this.setState({componentMounted: true})
    }


    setTimeout(() => {
      window.scrollTo(0,0)
    }, 500);//if first image overflow 100vh -- need?
  }

  render(){
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Emblema+One|Faster+One|Germania+One|IM+Fell+English|Pacifico|Plaster|Quantico|Quicksand|Share+Tech+Mono|Shrikhand" rel="stylesheet"/> 
        </Head>
        <div className='mainView'>
          <Feed/>
          <div style={{height: '0vh'}}>
          </div>
          <div className='blogHeader'> 
            <div className='flexContainerRow' style={{height: '20vh', width: '100%'}}>
              <div style={{flex: 1}}>
                <img src={'/static/deskof.svg'} style={{maxWidth: '100%', maxHeight: '100%'}}/>
              </div>
              <div style={{flex: 2, textAlign: 'center'}}>
                <div className='flexContainerColumn' style={{width: '100%'}}>
                  <div style={{flex: 1}}/>
                  <div style={{flex: 3}}>
                    <div>
                      <span style={{fontWeight: 'bold'}}>Welcome to the Blog</span>
                    </div>
                    <div>
                      I have strong opinions, held loosely, and I often say more than I know.
                    </div>
                    <div>
                      If you're offended, I don't care, go away - the Internet is a big place.
                    </div>
                    <div>
                      The fools have given me a keyboard and a place to write ~ Fear me!
                    </div>
                  </div>
                  <div style={{flex: 1}}/>
                </div>
              </div>
            </div>
            <hr/>
            <hr/>
            <div style={{clear: 'both'}}/>
          </div>
          <div className='blogTitleBar'>
            <div style={{display: 'inline-block', marginRight: '10px', marginBottom: '5px', background: 'rgb(70, 117, 84)', padding: '5px'}}>
              <span style={{fontWeight: 'bold'}}>{this.props.postData.title}</span> 
            </div>
            <div style={{display: 'inline-block', marginRight: '10px', background: 'rgb(70, 117, 84)', padding: '5px'}}>
              <span style={{fontWeight: 'bold'}}>{this.props.postData.dateText}</span> 
            </div>
            <div style={{display: 'inline-block', float: 'right', background: 'rgb(70, 117, 84)', padding: '5px'}}>
              <Link href='/blog/archive'> 
                <a href='' style={{cursor: 'pointer', textDecoration:'underline'}}>
                  archive
                </a>
              </Link>
            </div>
            <hr/>
          </div>
          <div style={{}}>
            {renderIf(this.state.masterArr!=[])(
              <div>
                {this.state.masterArr.map((item, index)=>{
                  console.log('value of item type: ', item.type=='body')
                  console.log('value of item.value: ', item.value)
                  if(item.type=='body'){
                    return(
                      <div className='blogBodyItem' key={index} style={{marginTop: '1vh'}}>
                        {item.value}
                      </div>
                    )
                  }else if (item.type=='file'){
                    return(
                      <div key={index} style={{marginLeft: '5%', width: '90%', marginTop: '1vh'}}>
                        <img src={`${`data:image/`+item.ext+`;base64,`+item.data}`} style={{height: '100%', width: '100%'}}/>
                      </div>
                    )
                  }
                })}
              </div>
            )}
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

export default Blog