import React, {Component} from 'react'

import '../styles/root.css'

class Welcome extends Component{

  render(){
    return(
      <div className='nav' style={{background: '', marginTop: '2vh'}}>
        <div style={{display: 'block', width: '100%', border: '10px dotted #aa6800', marginTop: '-10px', marginLeft: '-10px', marginBottom: '-10px', position: 'relative', textAlign: 'center'}}>
          <div className='allWhoCome' style={{display: 'inline-block', height: '8vh', marginTop: '1vh', marginBottom: '1vh', marginLeft: '1vw', lineHeight: '8vh', fontSize:'1.5vw'}}>
            All Who Come Are Welcome
          </div>
          <img src='/static/hamsa.png' style={{height: '8vh', maxWidth: '3vw', marginTop: '1vh', marginBottom: '1vh', marginRight: '1vw', float: 'right'}}/>
        </div>

      </div>
    )
  }
}
export default Welcome