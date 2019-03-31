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
import axios from 'axios';

import {getCookie} from '../services';

import Clock from '../components/Clock';



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
  static async getInitialProps({req, query}){
    console.log('inside getInitialProps')
    if (req){

      let latLng = {lat: null, lng: null}

      var pinReturn = await axios.post('http://localhost:5000/getPinData', {latLng}, {withCredentials: true})
      .then(response=>{
        console.log('value of response: ', response)
        return response.data.pins
      })
      .catch(error=>{
        console.log('value of error: ', error)
        return({})
      })

    }
    return {pinData: pinReturn}
  }

  state = {
    textVal: '',
    pixelWH: {},
    coordBound: {}, 
    bounds: {}, 
    pinData: [],
    date: new Date(),
  }

  // 30.2672° N, 97.7431° W

  handleBoundsChange = ({ center, zoom, bounds, initial }) => {
    if (initial) {
      console.log('Got initial bounds: ', bounds)
      let heightCoord = bounds.ne[0]-bounds.sw[0];
      let widthCoord = bounds.ne[1]-bounds.sw[1];
      this.setState({bounds: {top: bounds.ne[0], bottom: bounds.sw[0], left: bounds.ne[1], right: bounds.sw[1]}})
      this.setState({coordBound: {height: heightCoord, width: widthCoord}})
    }
    // this.setState({ center, zoom })
  }

  addPin = (latLng) => {
    axios.post('http://localhost:5000/addPinData', {latLng}, {withCredentials: true})
    .then(response=>{
      this.setState({pinData: response.data.pins})
    })
    .catch(error=>{
      console.log('there was an error: ', error)
    })
  }

  componentDidMount(){
    this.setState({pinData: this.props.pinData})
    console.log('inside componentDidMount')
    console.log('value of this.props.pinData: ', this.props.pinData)
    console.log('value of document.cookie: ', document.cookie)
    console.log('value of lat cookie: ', getCookie('potato')=='')
    let latLng = {lat: null, lng: null}
    console.log("")
    if(getCookie('lat')==''||getCookie('lng')==''){
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position)=>{
          console.log({ lat: position.coords.latitude, lng: position.coords.longitude });
          latLng = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.addPin(latLng)
        });  
      }else{
        this.addPin(latLng)
      }
    }else{
      latLng = {lat: getCookie('lat'), lng: getCookie('lng')}
      this.addPin(latLng)
    }
   

    let vwPixWidth = document.getElementsByTagName('body')[0].clientWidth * 0.55*0.8;
    let vwPixHeight = document.getElementsByTagName('body')[0].clientHeight * 0.45;
    console.log('vwPix: ', vwPixHeight)
    this.setState({pixelWH: {height: vwPixHeight, width: vwPixWidth}}, ()=>{
      console.log('after setState and value of pixelWH: ', this.state.pixelWH)
    })

    setInterval(
      () => this.setState({ date: new Date() }),
      1000
    );
  }

  map = () => {  
    var pinArray = this.state.pinData;
    // pinArray.push({lat: 43.0760, lng: -107.2903})
    console.log('value of pinArray: ', pinArray)
    var starCoord = [30.2672, -97.7431]
    var threadArray = [];
    if(Object.entries(this.state.bounds).length === 0){
      return(
        <Map 
          center={[38.879, -97.6997]}
          zoom={4} 
          minZoom={4}
          maxZoom={4}
          provider={
            (x, y, z) => {
              const retina = typeof window !== 'undefined' && window.devicePixelRatio >= 2 ? '@2x' : ''
              return `https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}${retina}.jpg`
            }
          }
          attribution={<NoneAttribution/>}
          onBoundsChanged={this.handleBoundsChange}
        ></Map>
      )
    }else{
      threadArray = pinArray.map(pin=>{
        let pinCoord = [pin.lat, pin.lng]
        console.log('value of pinCoord: ', pinCoord)
        console.log('value of this.state.bounds: ', this.state.bounds)
        let pinHeight = (Math.abs(this.state.bounds.top-pinCoord[0])/Math.abs(this.state.bounds.top-this.state.bounds.bottom))*this.state.pixelWH.height
  
        let pinWidth = (Math.abs(this.state.bounds.right-pinCoord[1])/Math.abs(this.state.bounds.left-this.state.bounds.right))*this.state.pixelWH.width
    
        let starHeight = (Math.abs(this.state.bounds.top-starCoord[0])/Math.abs(this.state.bounds.top-this.state.bounds.bottom))*this.state.pixelWH.height
    
        let starWidth = (Math.abs(this.state.bounds.right-starCoord[1])/Math.abs(this.state.bounds.left-this.state.bounds.right))*this.state.pixelWH.width
  
        var tangent = 0;
        let distance = Math.sqrt(Math.pow((pinHeight-starHeight), 2) + Math.pow((pinWidth-starWidth), 2))
        console.log('pinWidth: ', pinWidth)
        console.log('pinHeight: ', pinHeight)
        console.log('starWidth: ', starWidth)
        console.log('starHeight: ', starHeight)
        console.log('distance: ', distance)
        if(pinWidth<starWidth && pinHeight<starHeight){
          tangent = -Math.atan((Math.abs(pinWidth-starWidth)/Math.abs(pinHeight-starHeight)))*180/Math.PI-90;
          var returnObj = {distance, tangent, pinCoord}
          console.log('returnObj in if 1: ', returnObj)
          return(returnObj)
        }else if(pinWidth>starWidth && pinHeight<starHeight){
          tangent = Math.atan((Math.abs(pinWidth-starWidth)/Math.abs(pinHeight-starHeight)))*180/Math.PI-90;
          var returnObj = {distance, tangent, pinCoord}
          console.log('returnObj in if 2: ', returnObj)
          return(returnObj)
        }else if(pinWidth>starWidth && pinHeight>starHeight){
          tangent = Math.atan(Math.abs(pinHeight-starHeight)/(Math.abs(pinWidth-starWidth)))*180/Math.PI;
          var returnObj = {distance, tangent, pinCoord}
          console.log('returnObj in if 3: ', returnObj)
          return(returnObj)
        }else if(pinWidth<starWidth && pinHeight>starHeight){
          tangent = -Math.atan(Math.abs(pinHeight-starHeight)/(Math.abs(pinWidth-starWidth)))*180/Math.PI-180;
          var returnObj = {distance, tangent, pinCoord}
          console.log('returnObj in if 4: ', returnObj)
          return(returnObj)
        }
      })
      console.log('value of threadArray: ', threadArray)
      return(
        <Map 
          center={[38.879, -94.6997]}
          zoom={4} 
          minZoom={4}
          maxZoom={4}
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
            <img src='/static/paperbackground.jpg' style={{opacity:'0.6'}} alt='' />
          </Overlay>
          <Overlay anchor={[30.2672, -97.7431]} offset={[20, 20]}>
            <img src='/static/star.png' width={40} height={40} alt='' />
          </Overlay>
          {threadArray.map((pin, index)=>{  
            return(
              <Overlay key={index} anchor={starCoord} offset={[0,0]}>
                <div style={{border: '2px dashed rgb(176, 45, 48)', width: `${pin.distance}px`, height: '0px', transform: `rotate(${pin.tangent}deg)`, transformOrigin:'left'}}/>
              </Overlay>
            )
          })}
          {threadArray.map((pin, index)=>{
            return(
              <Overlay key={index} anchor={pin.pinCoord} offset={[25,25]}>
                <img src='/static/pin.png' width={50} height={50} alt='' />
              </Overlay>
            )
          })}
        </Map>
      )
    }
  }

  render(){
    return(
      <div className='gridContainer'>
        <Head>
          <title>patientplatypus</title>
          <link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Shrikhand" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css?family=Germania+One" rel="stylesheet"/> 
          <link href="https://fonts.googleapis.com/css?family=Quicksand:700" rel="stylesheet"/>
        </Head>
        <div className='mainView'>
          <Feed/>
          <div className='titleFont' style={{fontSize: '4vh', textAlign: 'center'}}>
            Welcome to patientplatypus
          </div>
          <div>  
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
          <div className='mapBoard' style={{width: 'calc(100% - 40px)', marginLeft: '10px', height: '50vh', border: '10px solid #2f1d0a', marginTop: '10px', position: 'relative'}}>
            <div style={{display: 'inline-block', height: '45vh',  marginTop: '2.5vh', width: 'calc(0.8 * 55vw)', marginRight: '5%', float: 'right', maskImage: "url('/static/mapmask.png')", maskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskImage:"url('/static/mapmask.png')"}}>
              {this.map()}
            </div>
            <div className='woodPlacard' style={{position: 'absolute', top: '-3vh', left: '0', display: 'inline-block', lineHeight: '5vh', paddingLeft: '0.5vw', paddingRight: '0.5vw', border: '5px rgb(203, 144, 3) solid', borderRadius: '5px', color: 'white', fontSize: '2vh'}}>
              NUMBER OF VISITORS
            </div>
            <div style={{position: 'absolute', top: 0, right: `${this.state.pixelWH.width/5}px`, transform: `scale(calc(${this.state.pixelWH.width}/1000))`}}>
              <Clock/>
            </div>
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