import React, { Component } from 'react'
import Link from 'next/link'
import '../styles/root.css'

import NavMenu from '../components/NavMenu'
import Head from 'next/head'
import renderIf from 'render-if'
import Feed from '../components/Feed'
import Chat from '../components/Chat'

import Map from 'pigeon-maps'
import Overlay from 'pigeon-overlay'

import '../styles/root.css'


const MapboxAttribution = () => (
  <span className='map-attribution'>
    <span>© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a></span>{' | '}
    <span>© <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a></span>{' | '}
    <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>
  </span>
)

const StamenAttribution = () => (
  <span className='map-attribution'>
    Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.
  </span>
)

const NoneAttribution = () => (
  <span className='map-attribution'>  
  </span>
)

const WikimediaAttribution = () => (
  <span className='map-attribution'>
    Map tiles by <a href='https://foundation.wikimedia.org/w/index.php?title=Maps_Terms_of_Use#Where_does_the_map_data_come_from.3F'>Wikimedia</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>
  </span>
)

class FeedPage extends Component{
  // static async getInitialProps({req, query}){
  //   if(!req){
  //     console.log('document: ', document)
  //   }
  //   return({thing: {}})
  // }
  state = {
    textVal: '',
    pixelWH: {},
    coordBound: {}, 
    bounds: {}
  }

  // 30.2672° N, 97.7431° W

  handleBoundsChange = ({ center, zoom, bounds, initial }) => {
    if (initial) {
      console.log('Got initial bounds: ', bounds)
      let heightCoord = bounds.ne[0]-bounds.sw[0];
      let widthCoord = bounds.ne[1]-bounds.sw[1];
      this.setState({bounds: {top: bounds.ne[0], bottom: bounds.sw[0], left: bounds.ne[1], right: bounds.sw[1]}})
      this.setState({coordBound: {height: heightCoord, width: widthCoord}})
      // console.log('value of heightCoord: ', heightCoord, ' widthCoord: ', widthCoord)
      // console.log('value of pix/coord Height: ', this.state.pixelWH.height/heightCoord)
      // console.log('value of pix/coord Width: ', this.state.pixelWH.width/widthCoord)
      // this.setState({pixCoord: {height: this.state.pixelWH.height/heightCoord, width: this.state.pixelWH.width/widthCoord}})
    }
    // this.setState({ center, zoom })
  }

  componentDidMount(){
    console.log('inside componentDidMount')
    console.log('value of document: ', document)
    let vwPixWidth = document.getElementsByTagName('body')[0].clientWidth * 0.55*0.8;
    let vwPixHeight = document.getElementsByTagName('body')[0].clientHeight * 0.45;
    console.log('vwPix: ', vwPixHeight)
    this.setState({pixelWH: {height: vwPixHeight, width: vwPixWidth}}, ()=>{
      console.log('after setState and value of pixelWH: ', this.state.pixelWH)
    })
  }

  map = () => {  
    let distance = Math.sqrt(Math.pow((38.879-30.3672), 2) + Math.pow((-97.6997+97.7431), 2))
    console.log('value of distance: ', distance)
    let pinCoord = [43, -110.6997]
    let starCoord = [30.2672, -97.7431]

    let pinHeight = (Math.abs(this.state.bounds.top-pinCoord[0])/Math.abs(this.state.bounds.top-this.state.bounds.bottom))*this.state.pixelWH.height

    let pinWidth = (Math.abs(this.state.bounds.right-pinCoord[1])/Math.abs(this.state.bounds.left-this.state.bounds.right))*this.state.pixelWH.width

    let starHeight = (Math.abs(this.state.bounds.top-starCoord[0])/Math.abs(this.state.bounds.top-this.state.bounds.bottom))*this.state.pixelWH.height

    let starWidth = (Math.abs(this.state.bounds.right-starCoord[1])/Math.abs(this.state.bounds.left-this.state.bounds.right))*this.state.pixelWH.width

    let diagDist = Math.sqrt(Math.pow((pinHeight-starHeight), 2) + Math.pow((pinWidth-starWidth), 2))
    let tangent = 0;
    if(pinWidth<starWidth && pinHeight<starHeight){
      tangent = -Math.atan((Math.abs(pinWidth-starWidth)/Math.abs(pinHeight-starHeight)))*180/Math.PI-90;
    }else if(pinWidth>starWidth && pinHeight<starHeight){
      tangent = Math.atan((Math.abs(pinWidth-starWidth)/Math.abs(pinHeight-starHeight)))*180/Math.PI-90;
    }else if(pinWidth>starWidth && pinHeight>starHeight){
      tangent = Math.atan(Math.abs(pinHeight-starHeight)/(Math.abs(pinWidth-starWidth)))*180/Math.PI;
    }else if(pinWidth<starWidth && pinHeight>starHeight){
      tangent = -Math.atan(Math.abs(pinHeight-starHeight)/(Math.abs(pinWidth-starWidth)))*180/Math.PI-180;
    }


    console.log('value of tangent: ', tangent)
    // body = d.getElementsByTagName('body')[0],
    // let vwPix = document.getElementsByTagName('body')[0].clientHeight * 0.65;
    // console.log('window: ', window)
    return(
      <Map 
        center={[38.879, -97.6997]}
        zoom={4} 
        provider={
          (x, y, z) => {
            const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2 ? '@2x' : ''
            return `https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}${retina}.jpg`
          }
        }
        attribution={<NoneAttribution/>}
        onBoundsChanged={this.handleBoundsChange}
      >
        <Overlay anchor={[38.879, -97.6997]} offset={['-100%','-100%']}>
          <img src='/static/paperbackground.jpg' style={{opacity:'0.5'}} alt='' />
        </Overlay>
        <Overlay anchor={starCoord} offset={[0,0]}>
          <div style={{border: '2px dashed rgb(176, 45, 48)', width: `${diagDist}px`, height: '0px', transform: `rotate(${tangent}deg)`, transformOrigin:'left'}}/>
        </Overlay>
        <Overlay anchor={pinCoord} offset={[25,25]}>
          <img src='/static/pin.png' width={50} height={50} alt='' />
        </Overlay>

        <Overlay anchor={[30.2672, -97.7431]} offset={[13, 13]}>
          <img src='/static/star.png' width={26} height={26} alt='' />
        </Overlay>
      </Map>
    )
  }

  render(){
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
          <div className='titleFont' style={{fontSize: '4vh', textAlign: 'center'}}>
            Welcome to patientplatypus
          </div>
          <div className=''>  
            <div style={{width: '15vw', marginLeft: '1vw', marginRight: '1vw', display: 'inline-block'}}>
              <img src='/static/hellotheresailor.svg' style={{width: '100%'}}/>
            </div>
            <div className='card' style={{width: 'calc(100% - 19vw)', display: 'inline-block', verticalAlign: 'top'}}>
              <div>
                Hi 👋
              </div>
              <div>
                This is a side project website that I'm working on. It's primarily a web forum with some pretty pictures. Right now it has a chat and blog as well. I'll be adding cool things as I go. Navigation on the top right. Cheers 🍻
              </div>
            </div>
          </div>
          <div style={{height: '45vh', width: '80%', marginLeft: '10%'}}>
            {this.map()}
          </div>
        </div>
        
        <div className='rightContainer'>
          <div style={{height: '10vh', width: '100%', background: ''}}>
            <div className='allWhoCome' style={{display: 'inline-block', height: '8vh', marginTop: '1vh', marginBottom: '1vh', marginLeft: '1vw', lineHeight: '8vh', fontSize:'1.9vw', width: '20vw'}}>
              All Who Come Are Welcome
            </div>
            <img src='/static/hamsa.png' style={{height: '8vh', maxWidth: '3vw', marginTop: '1vh', marginBottom: '1vh', marginRight: '1vw', float: 'right'}}/>
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

export default FeedPage