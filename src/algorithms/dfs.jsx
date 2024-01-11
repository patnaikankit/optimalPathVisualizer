// dfs algo 

export const dfs = (board, start, goal) => {
    var visited = [], stack = [start];
    while(stack){
        var curNode = stack.pop()
        if(curNode === undefined){
            return 0;
        }

        if(curNode === goal){
            return visited;
        }
        
        if(!curNode.isWall && (!curNode.isVisited || curNode.isStart)){
            curNode.isVisited = true;
            visited.push(curNode);
            const col = curNode.col;
            const row = curNode.row;

            var nextNode; 
            
            if(row > 0){
                nextNode = board[row - 1][col];
                if(!nextNode.isVisited){
                    stack.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

            if(row < board.length - 1){
                nextNode = board[row + 1][col];
                if(!nextNode.isVisited){
                    stack.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

            if(col > 0){
                nextNode = board[row][col - 1];
                if(!nextNode.isVisited){
                    stack.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

            if(col < board[0].length - 1){
                nextNode = board[row][col + 1];
                if(!nextNode.isVisited){
                    stack.push(nextNode);
                    nextNode.parent = curNode;
                }
            }       
        }
    }
}