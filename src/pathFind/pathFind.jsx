import React, { Component } from "react";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";
import './pathFind.css'
import Node from "./node";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const numOfRows = 25;
const numOfColumns = 50;


export default class PathFind extends Component{
    constructor(){
        super();
        this.state = {
            board: [],
            startnode_row: 10,
            startnode_col: 15,
            GOALNODE_ROW: 16,
            GOALNODE_COL: 30,
            mouseIsPressed: false,
            isRunning: false,
            isBoardClean: true,
            numOfExpandedNodes: 0,
            numOfPathNodes: 0,
            chooseStart: false,
            chooseGoal: false,
            changeWall: true
        }
    }

    handleMouseDown(row, col){
        const{
            board, 
            chooseStart, 
            startnode_row, 
            startnode_col, 
            isBoardClean, 
            chooseGoal, 
            GOALNODE_ROW, 
            GOALNODE_COL,
            changeWall } = this.state;

        var newBoard;
        if(chooseStart === true && isBoardClean === true){
            newBoard = changeStart(board, row, col);
            const lastStartNode = newBoard[startnode_row][startnode_col]
            lastStartNode.isStart = false;
            this.setState({board: newBoard, startnode_row: row, startnode_col: col, chooseStart: false});
        }
        else if(chooseGoal === true && isBoardClean === true){
            newBoard = changeGoal(board, row, col);
            const lastStartNode = newBoard[GOALNODE_ROW][GOALNODE_COL];
            lastStartNode.isGoal = false;
            this.setState({board: newBoard, GOALNODE_ROW: row, GOALNODE_COL: col, chooseGoal: false});
        }
        else if(isBoardClean === true){
            if(board[row][col].isWall === false){
                this.setState({changeWall: true})
                newBoard = wallGenerate(board, row, col, true);
            }
            else{
                this.setState({changeWall: false})
                newBoard = wallGenerate(board, row, col, false);
            }
            this.setState({board: newBoard, mouseIsPressed: true});
        }
    }
}