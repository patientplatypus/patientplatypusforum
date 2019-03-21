import React, { Component } from "react";

import '../styles/root.css'

export const VerticalCenter = (props) => {
  return(
    <div className='flexContainerColumn'>
      <div style={{flex: 1}}/>
      <div style={{flex: 1}}>
        {props.children}
      </div>
      <div style={{flex: 1}}/>
    </div>
  )
}