// bfs algo

export const bfs = (board, start, goal) => {
    var vis = [], queue = [start];
    while(queue){
        var curNode = queue.shift();
        if(curNode === undefined){
            return 0;
        }

        if(curNode === goal){
            return vis;
        }
        
        if(!curNode.isWall && (!curNode.isvis||curNode.isStart)){
            curNode.isvis = true;
            vis.push(curNode);
            const col = curNode.col;
            const row = curNode.row;
            var nextNode;
            
            if(row > 0){
                nextNode = board[row - 1][col];
                if(!nextNode.isvis){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

            if(col > 0){
                nextNode = board[row][col - 1];
                if(!nextNode.isvis){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

            if(row < board.length - 1){
                nextNode = board[row + 1][col];
                if(!nextNode.isvis){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }
            
            if(col < board[0].length - 1){
                nextNode = board[row][col + 1];
                if(!nextNode.isvis){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }
        }
    }
}