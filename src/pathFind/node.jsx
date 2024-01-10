import './node.css'
import React, { Component } from 'react'

export default class Node extends Component{
    render(){
        const {
            row,
            col,
            isStart,
            isGoal,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp
        } = this.props

        const extra = isGoal ? 'node-goal': isStart ? 'node-start' : isWall   ? 'node-wall' : '';
        
        return(
            <div
                id = {`node-${row}-${col}`}
                className = {`node ${extra}`}
                onMouseDown = {()=> onMouseDown(row, col)}
                onMouseEnter = {()=> onMouseEnter(row, col)}
                onMouseUp = {()=> onMouseUp(row, col)}        
            ></div>
        );
    }
}