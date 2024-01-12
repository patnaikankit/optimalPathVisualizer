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
            board: [],                // Represents the grid of nodes
            startnode_row: 10,        // Default row position of the start node
            startnode_col: 15,        // Default column position of the start node
            GOALNODE_ROW: 16,         // Default row position of the goal node
            GOALNODE_COL: 30,         // Default column position of the goal node
            mouseIsPressed: false,    // Indicates whether the mouse is currently pressed
            isRunning: false,         // Indicates whether a pathfinding algorithm is currently running
            isBoardClean: true,       // Indicates whether the board is in a clean state
            numOfExpandedNodes: 0,    // Number of nodes expanded during pathfinding
            numOfPathNodes: 0,        // Number of nodes in the final path
            chooseStart: false,       // Indicates whether the user is currently choosing the start node
            chooseGoal: false,        // Indicates whether the user is currently choosing the goal node
            changeWall: true          // Indicates whether to change a cell to a wall during grid interaction
        }
        
    }
    
    // initialize grid based on the specified number of rows and columns 
    componentDidMount(){
        this.setState({board: this.getInitBoard()});
    }
    

    // function to handle grid interaction such as choosing start and end node and genearting a wall
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

        // choosing the start node and the board is clean
        if(chooseStart === true && isBoardClean === true){
            newBoard = changeStart(board, row, col);
            const lastStartNode = newBoard[startnode_row][startnode_col]
            lastStartNode.isStart = false;
            this.setState({board: newBoard, startnode_row: row, startnode_col: col, chooseStart: false});
        }

        // choosing the goal node and the board is clean
        else if(chooseGoal === true && isBoardClean === true){
            newBoard = changeGoal(board, row, col);
            const lastStartNode = newBoard[GOALNODE_ROW][GOALNODE_COL];
            lastStartNode.isGoal = false;
            this.setState({board: newBoard, GOALNODE_ROW: row, GOALNODE_COL: col, chooseGoal: false});
        }

        // the board is clean, handle wall generation
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

    handleMouseUp(){
        this.setState({mouseIsPressed: false, changeWall: true});
    }

    handleMouseEnter(row, col){
        const { changeWall } = this.state;
        if(this.state.mouseIsPressed){
            const newBoard = wallGenerate(this.state.board, row, col, changeWall);
            this.setState({board: newBoard});
        }
    }

    // function to initialize nodes in the grid
    newNode(row, col) {
        return {
            row,                                           // Row position of the node
            col,                                           // Column position of the node
            isStart: row === this.state.startnode_row && col === this.state.startnode_col,  // Whether the node is the start node
            isGoal: row === this.state.GOALNODE_ROW && col === this.state.GOALNODE_COL,     // Whether the node is the goal node
            isWall: false,                                 // Whether the node is a wall (initialized as false)
            isVisited: false,                              // Whether the node has been visited (initialized as false)
            parent: null                                   // Reference to the parent node (initialized as null)
        };
    }
    

    // responsble for generating the initial board
    getInitBoard(){
        const board = [];
        for(let i = 0; i < numOfRows; i++){
            const currRow = [];
            for(let j = 0; j < numOfColumns; j++){
                var node = this.newNode(i, j);
                currRow.push(node);
            }
            board.push(currRow);
        }
        return board;
    }


    //  initiating pathfinding algorithm based on the specified algorithm type
    search(algo){
        // set flags to indicate the board is no longer clean and a pathfinding algorithm is running
        if(this.state.isBoardClean){
            this.setState({isBoardClean: false});
            this.setState({isRunning: true});

            // Get the current board
            var{ board } = this.state;

            // extract start and goal nodes from the board
            var start = board[this.state.startnode_row][this.state.startnode_col];
            var goal = board[this.state.GOALNODE_ROW][this.state.GOALNODE_COL];

            // variable to store visited nodes during the pathfinding algorithm
            var visited;


            switch(algo){
                case "bfs":
                    visited = bfs(board, start, goal);
                    break;
                case "dfs":
                    visited = dfs(board, start, goal);
                    break;
                default:
                    console.log("Nice");
                }  
            
            // no path found
            if(visited === 0){
                alert("There is no path");
            }
            // path found
            else{
                // calculate the shortest path
                var way = shortWay(goal);
                // visualize the pathfinding process
                this.visualise(visited, way);
            }
            // process finished 
            this.setState({isRunning: false})
        }   
    }
    
    // start checking all possible paths from start node
    visualise(visited, path){
        for(var i = 0; i <= visited.length; i++){
            this.setState({numOfExpandedNodes: visited.length, numOfPathNodes: path.length + 1});
            if(i === visited.length){
                setTimeout(()=>{
                    this.animatePath(path)
                }, 10*i);
                return;
            }
            const node = visited[i];
            if(node.isStart){
                continue;
            }
            else{
                setTimeout(() => {
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }, 10*i)
            }
            
        }
    }
    
    // function to handle the clear grid event and resetting certain state variables
    clearGrid(){
        if(!this.state.isRunning){
            const {board} = this.state;
            for(var i = 0; i < board.length; i++){
                for(var j = 0; j < board[0].length; j++){
                    const node = board[i][j];

                    // if the node is not the start or goal node, reset its class and isVisited property
                    if(!node.isStart && !node.isGoal){
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                        node.isVisited = false;
                    }

                    // if the node is a wall, reset its isWall property
                    if(node.isWall){
                        node.isWall = false;
                    }
                }
            }
            this.setState({isBoardClean: true, numOfExpandedNodes: 0, numOfPathNodes: 0});
        }
    }
    
    // visualize the path once it is found
    animatePath(path){
        for(var i = 0; i < path.length; i++){
            const node = path[i];
            setTimeout(() => {
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path';
            }, 10*i);
        }
    }

    
    render() {
        const{board, mouseIsPressed} = this.state;
        return (
          <>
          <div className="instructions results">
            <div className='res-item'>Expanded nodes: {this.state.numOfExpandedNodes}</div>
            <div className='res-item'>Path Length: {this.state.numOfPathNodes}</div>
          </div>
           <div className="instructions">
                <div className = "instructions-item">
                    <span className="square node-unvisited"></span>
                    Unvisited Node
                </div>
                <div className = "instructions-item">
                    <span className="square node-visited"></span>
                    Visited Node
                </div>
                <div className = "instructions-item">
                    <span className="square n-start"></span>
                    Start Node
                </div>
                <div className = "instructions-item">
                    <span className="square n-goal"></span>
                    Goal Node
                </div>
                <div className = "instructions-item">
                    <span className="square node-wall"></span>
                    Wall Node
                </div>
                <div className = "instructions-item">
                    <span className="square node-path"></span>
                    Path
                </div>
            </div>
            <div className = "grid">
              {board.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const row = node.row;
                      const col = node.col;
                      const isGoal = node.isGoal;
                      const isStart = node.isStart;
                      const isWall = node.isWall;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isGoal={isGoal}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          row={row}></Node>
                      );
                    })}
                    
                  </div>
                  
                );
              })}
              <div class="buttons">
            <Button variant="btn btn-success" onClick={() => this.search("dfs")}>DFS</Button>{' '}
            <Button variant="btn btn-success" onClick={() => this.search("bfs")}>BFS</Button>{' '}
            
            <Button variant="btn btn-primary" onClick={() => this.setState({chooseStart: true, chooseGoal: false})}>Choose Start</Button>{' '}
            <Button variant="btn btn-primary" onClick={() => this.setState({chooseStart: false, chooseGoal: true})}>Choose Goal</Button>{' '}
            <Button variant="btn btn-danger" onClick={() => this.clearGrid()}>Clear Grid</Button>{' '}
              </div>
            </div>
          </>
        );
      }
    }


    // function to generate a wall
    const wallGenerate = (board, row, col, cond) => {
        const newBoard = board.slice();
        const node = newBoard[row][col];
        if(!node.isStart && !node.isGoal){
            var newNode;
            if(cond){
                newNode = {
                    ...node,
                    isWall: true,
                };
            }
            else{
                newNode = {
                    ...node,
                    isWall: false
                };
            }
            newBoard[row][col] = newNode;
        } 
        return newBoard;
    }

    // function to handle the change start event
    const changeStart = (board, row, col) => {
        const newBoard = board.slice()
        const node = newBoard[row][col]
        if(!node.isGoal && !node.isWall){
            const newNode = {
                ...node,
                isStart: true
            }
            newBoard[row][col] = newNode;
        }
        document.querySelector(".node-start").classList.remove("node-start")
        return newBoard;
    }


    // function to handle the change end event
    const changeGoal = (board, row, col) => {
        const newBoard = board.slice()
        const node = newBoard[row][col]
        if(!node.isStart && !node.isWall){
            const newNode = {
                ...node,
                isGoal: true
            }
            newBoard[row][col] = newNode;
        }
        document.querySelector(".node-goal").classList.remove("node-goal")
        return newBoard;
    }

    // function to find the shortest if a path exists
    const shortWay = (goal) => {
        var shortPath = [];
        var currNode = goal;
        while(currNode.parent.parent !== null){
            currNode = currNode.parent;
            shortPath.unshift(currNode)
            
        }
        return shortPath;
    }