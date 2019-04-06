import React, { Component } from 'react';
import renderIf from 'render-if'
import Ticker from 'react-ticker'
import axios from 'axios';

import {MainContext} from '../services';

import '../styles/root.css'

class RadioContext extends Component{
  state={
    stationName: "HELLO THIS IS RADIO", 
    componentMounted: false, 
    channelNum: 0, 
  }

  vidRef = React.createRef();

  componentDidMount(){
    console.log('97934792837423947239847 value of this.props.context.state: ', this.props.context.state)
    if(this.props.context.state.play==true){
      setTimeout(() => {
        this.vidRef.play();
        this.vidRef.volume = 0.5; 
      }, 0);
    }
    console.log('97934792837423947239847 value of this.state.channelNum: ', this.state.channelNum)
    this.setState({componentMounted: true, channelNum: this.props.context.state.channelNum, stationName: this.props.context.state.stationName})
  }

  handleChangeChannel(type){
    console.log('97934792837423947239847 inside handleChangeChannel and type: ', type)
    if(type=='next'){
      var newChannelNum = Math.abs((this.state.channelNum+1)%10)
      if (newChannelNum < 0){
        newChannelNum = 10 + newChannelNum
      }
      this.setState({channelNum: newChannelNum, stationName: this.props.context.state.stations[newChannelNum]['name']}, ()=>{
        this.props.context.setState('channelNum', this.state.channelNum)
        this.props.context.setState('stationName', this.state.stationName)
        console.log('97934792837423947239847 value of this.state.channelNum: ', this.state.channelNum)
        this.vidRef.play();
      })
    }else if(type=='prev'){
      var newChannelNum = (this.state.channelNum-1)%10
      if (newChannelNum < 0){
        newChannelNum = 10 + newChannelNum
      }
      console.log('97934792837423947239847 value of newChannelNum: ', newChannelNum)
      console.log('97934792837423947239847 value of this.props.context.state.stations[newChannelNum]', this.props.context.state.stations[newChannelNum])
      this.setState({channelNum: newChannelNum, stationName: this.props.context.state.stations[newChannelNum]['name']}, ()=>{
        this.props.context.setState('channelNum', this.state.channelNum)
        this.props.context.setState('stationName', this.state.stationName)
        console.log('97934792837423947239847 value of this.state.channelNum: ', this.state.channelNum)
        this.vidRef.play();
      })
    }
  }

  render(){
    return(
      <div className='radioBackground' style={{minHeight: '10vh', width: '90%', float: 'left', color: 'rgb(231, 146, 8)', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', marginLeft: '-2px'}}>
        {renderIf(this.props.context.state.play && this.state.componentMounted)(
          <video ref={(input)=>this.vidRef = input} height={0} width={0} src={`${this.props.context.state.stations[this.state.channelNum]['url']}`}/>
        )}
        <div style={{fontSize: '1.5vh', marginLeft: '1vw', width: '1vw', marginRight: '1vw', display: 'inline-block', height: '100%', float: 'left'}}>
          <div className='flexContainerColumn' style={{textAlign: 'center'}}>
            <div className='radioHeader' style={{flex: 1}}>
              R
            </div>
            <div className='radioHeader' style={{flex: 1}}>
              A
            </div>
            <div className='radioHeader' style={{flex: 1}}>
              D
            </div>
            <div className='radioHeader' style={{flex: 1}}>
              I
            </div>
            <div className='radioHeader' style={{flex: 1}}>
              O
            </div>
          </div>
        </div>
        <div style={{display: 'inline-block', width: 'calc(75% - 3.5vw)', height: '100%', position: 'relative', float: 'left'}}>
          <div className='flexContainerColumn'>
            <div style={{flex: 1}}>
              <div
              style={{border: '2px silver solid', background: 'rgb(118, 46, 30, 0.8)', color: 'rgb(205, 132, 13)', overflowWrap: 'anywhere', width: 'calc(100% - 5px)', height: '3vh', lineHeight: '3vh', overflow: 'hidden', fontSize: '2.5vh', textAlign: 'center', position: 'relative', marginTop: '2px'}}
              disabled="disabled">
                <div style={{position: 'absolute', top: '0', left: '0', textShadow: '0 0 3px #FF0000', color: 'rgba(205, 132, 13, 0.6)', opacity: '0.5'}}>
                  🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠🂠
                </div>
                <Ticker
                  offset="run-in"
                  speed={3}
                  >
                    { ({index})=><div className='radioInfo' style={{display: 'inline-block', whiteSpace: 'nowrap', textShadow: '0 0 1px #FF0000', color: 'rgba(205, 132, 13, 0.6)',}}>{this.state.stationName}</div>
                    }
                  </Ticker>
              </div>
            </div>
            <div style={{flex: 1}}>
              <div style={{display: 'inline-block', width: '100%', paddingTop: '0.2vh', textAlign: 'center'}}>
                <div className='radioInfo' style={{display: 'inline-block', height: '5vh', width: 'calc(40% - 5px)', display: 'inline-block', marginLeft: '5px', textAlign: 'center'}}>
                  <div style={{fontSize: '1vw', marginTop: '1vh'}}>
                  VOL.
                  </div>
                  <div style={{marginTop: '-5px', fontSize: '1vw'}}>
                    <input type="range" min="1" max="100" id="myRange" style={{display: 'inline-block', width: '100%', cursor: 'grab'}} onChange={(e=>{
                      this.vidRef.volume = e.target.value/100
                    })}
                    ></input> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{display: 'inline-block', width: '25%', height: '10vh', position: 'relative', float: 'left', marginLeft: '0.25vw'}}>
          <div className='flexContainerColumn' style={{height: 'calc(100% - 4px)' ,width: 'calc(100% - 4px)', marginTop: '4px', marginLeft: '2px', marginRight: '2px', maxHeight: '10vh'}}>
            {renderIf(!this.props.context.state.play)(
              <div className='radioButtonColors' style={{flex: 1, border: '1px silver solid', borderRadius:'5px'}}
              onClick={()=>{
                this.props.context.setState('play', true)
                console.log('value of stationName: ', this.props.context.state.stations[this.state.channelNum]['name'])
                this.setState({stationName: this.props.context.state.stations[this.state.channelNum]['name']}, ()=>{
                  this.props.context.setState('stationName', this.state.stationName)
                  this.vidRef.play();
                  this.vidRef.volume = 0.5;
                })
              }}
              >
                <div style={{width: '100%', textAlign: 'center', paddingTop: '0.25vw', fontSize: '1.5vw', cursor: 'pointer'}}>
                  ▶
                </div>
              </div>
            )}
            {renderIf(this.props.context.state.play)(
              <div className='radioButtonColors' style={{flex: 1, border: '1px silver solid', borderRadius:'5px'}}
              onClick={()=>{
                this.vidRef.pause()
                this.props.context.setState('play', false)
                this.setState({play: false, stationName: 'Radio Stopped'}, ()=>{
                  this.props.context.setState('stationName', this.state.stationName)
                })
              }}
              >
                <div style={{width: '100%', textAlign: 'center', paddingTop: '0.25vw', fontSize: '1.5vw', cursor: 'pointer'}}>
                  ■
                </div>
              </div>
            )}
            <div style={{flex: 1}}>
              <div className='flexContainerRow radioInfo' style={{height: '100%', width: '100%'}}>
                <div style={{flex: 1}}/>
                <div className='radioButtonColors' style={{flex: 3, fontSize: '0.75vw', alignSelf:'center', textAlign: 'center', paddingBottom: '0.1rem',  border: '1px silver solid', paddingLeft: '2px',paddingRight: '2px', cursor: 'pointer'}}
                onClick={()=>{this.handleChangeChannel('prev')}}
                >
                  Prev
                </div>
                <div style={{flex: 1}}/>
                <div className='radioButtonColors' style={{flex: 3, fontSize: '0.75vw', alignSelf:'center', textAlign: 'center', paddingBottom: '0.1rem', border: '1px silver solid', paddingLeft: '2px',paddingRight: '2px', cursor: 'pointer'}}
                onClick={()=>{this.handleChangeChannel('next')}}
                >
                  Next
                </div>
                <div style={{flex: 1}}/>
              </div>
            </div>
          </div>
        </div>
        <div style={{clear: 'both'}}/>
      </div>
    )
  }
}

class Radio extends Component{
  render(){
    return(
      <MainContext.Consumer>
        {context => {
          return(
            <div>
              <RadioContext context={context}/>
            </div>
          )
        }}
      </MainContext.Consumer>
    )
  }
}

export default Radio