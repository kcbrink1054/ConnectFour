import React, { Component } from 'react';
import COLOR from '../shared/color';

function Circle(props){
    let circleStyle = ""
    switch(props.color){
        case COLOR.RED: 
            circleStyle = "circle circle-red"
            break;
        case COLOR.BLACK:
            circleStyle = "circle circle-black"
            break;

        default:
            circleStyle = "circle"
    }

    return(
        <span className={circleStyle} onClick={()=>{props.HandleSelection(props.col)}}></span> 
    )
}
export default Circle;