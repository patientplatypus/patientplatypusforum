
import React, { Component } from 'react'

var logged = false;
class Clock extends Component {
  constructor(props) {
    super(props);

    this.state = {
        timer: setInterval(this.setDate.bind(this), 1000),
        secondDegrees: 0,
        minuteDegrees: 0,
        hourDegrees: 0
    }
  }
  componentWillUnmount() {
      clearInterval(this.state.timer);
  }

  setDate() {

    const now = new Date();
    const second = now.getSeconds();
    const minute = now.getMinutes();
    const hour = now.getHours();

    console.log('clock value of second: ', second)
    console.log('clock value of minute: ', minute)
    console.log('clock value of hour: ', hour)

    this.setState({
      secondDegrees:  (second/60) * 360 + 90,
      minuteDegrees: ((minute/60) * 360)%360,
      hourDegrees:  ((hour/12) * 360)%360 + ((minute/60) * 30),
    }, ()=>{
      console.log('after setState in clock and value: ', this.state)
    });
  }

  render() {
    const secondStyle = {
        transform: `rotate(${this.state.secondDegrees}deg)`
    };
    const minuteStyle = {
        transform: `rotate(${this.state.minuteDegrees}deg)`
    };
    const hourStyle = {
        transform: `rotate(${this.state.hourDegrees}deg)`
    };
    return (
      <div className="col-md-6">
        <div className="clock">
          <div style={{position: 'absolute', top: 0, left: 'calc(50% - 0.75rem)', fontSize: '1.5rem', color: 'rgb(223, 203, 161)', fontWeight: 'bold'}}>
            12
          </div>
          <div style={{position: 'absolute', bottom: '-5px', left: 'calc(50% - 0.375rem)', fontSize: '1.5rem', color: 'rgb(223, 203, 161)', fontWeight: 'bold'}}>
            6
          </div>
          <div style={{position: 'absolute', top: 'calc(50% - 0.75rem)', right: '2px', fontSize: '1.5rem', color: 'rgb(223, 203, 161)', fontWeight: 'bold'}}>
            3
          </div>
          <div style={{position: 'absolute', top: 'calc(50% - 0.75rem)', left: '2px', fontSize: '1.5rem', color: 'rgb(223, 203, 161)', fontWeight: 'bold'}}>
            9
          </div>
          <div className="clock-face">
            <div className="hand hour-hand" style={hourStyle}></div>
            <div className="hand min-hand" style={minuteStyle}></div>
            <div className="hand second-hand" style={secondStyle}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Clock;