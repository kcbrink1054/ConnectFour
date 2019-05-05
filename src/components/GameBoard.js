import React from 'react';
import Circle from './circle'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {_} from 'underscore';
import COLOR from '../shared/color';

class GameBoard extends React.Component{
    constructor(props){
        super(props);
        const row = 6
        const column = 7
        this.state = {
            row: row,
            column: column,
            board: this.SetupBoardState(column, row),
            activePlayer:  COLOR.NONE,
            selection: {row:0, col:0},
            gameOver: false,
            modal: true,
            isTie: false,
            gameOverModal: false
        }
        this.HandleSelection = this.HandleSelection.bind(this)
        this.SetSelection = this.SetSelection.bind(this)
        this.SetPlayer = this.SetPlayer.bind(this)
        this.ScanForWin = this.ScanForWin.bind(this)
        this.SetPlayerOne = this.SetPlayerOne.bind(this)
        this.ScanForTie = this.ScanForTie.bind(this)
        this.toggle = this.toggle.bind(this)
    }
    
    SetupBoardState(column, row){
        const board = []
            _.times(row, (x)=>{
               _.times(column,(y)=>{
                board.push({
                    row: x,
                    col: y,
                    color:COLOR.NONE
                })
            }) 
        })
        return board;
    } 

    HandleSelection(col){
        if (!this.state.gameOver) {
            this.SetSelection(col)
            let results = this.ScanForWin(col)

            if (results) {
                this.setState({
                    gameOver: true,
                    gameOverModal: true
                })
                return;
            }
            if(_.findLastIndex(this.state.board,{col:col,color:COLOR.NONE}) !== -1)
                this.SetPlayer()
        }
    }

    ScanForTie(){
        let results = _.findIndex(this.state.board,{color:COLOR.NONE})
        if (results === -1) 
        this.setState({
            gameOver: true,
            gameOverModal: true,
            isTie: true
        })
    }

    ScanForWin(column){
        let results = _.findLastIndex(this.state.board,{col:column,color:COLOR.NONE})
        if (results === -1) return;
        let row = this.state.board[results].row
        let col = column;
        let count = this.ScanHorizontalForWin(row, col, 1, this.state.board, [_.findIndex(this.state.board  ,{row:row, col:col,color:this.state.activePlayer})])
        console.log("Current Count " + this.state.activePlayer + ": " + count)
        if (count ===4) return true;
        count = this.ScanVerticalForWin(row, col, 1, this.state.board, [_.findIndex(this.state.board  ,{row:row, col:col,color:this.state.activePlayer})])
        console.log("Current Count " + this.state.activePlayer + ": " + count)
        if (count ===4) return true;
        count = this.ScanDiagonalBackwardForWin(row, col, 1, this.state.board, [_.findIndex(this.state.board  ,{row:row, col:col,color:this.state.activePlayer})])
        console.log("Current Count " + this.state.activePlayer + ": " + count)
        if (count ===4) return true;
        count = this.ScanDiagonalForwardForWin(row, col, 1, this.state.board, [_.findIndex(this.state.board  ,{row:row, col:col,color:this.state.activePlayer})])
        console.log("Current Count " + this.state.activePlayer + ": " + count)
        if (count ===4) return true;
        return false;
    }

    ScanHorizontalForWin(row, col, count, board,indexScanned){
        let index = _.findIndex(board,{row:row, col:col-1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanHorizontalForWin(row, col-1, count+1, board, indexScanned)
        }
        index = _.findIndex(board,{row:row, col:col+1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanHorizontalForWin(row, col+1, count+1, board, indexScanned)
        }        
        return count
    }
    ScanVerticalForWin(row, col, count, board,indexScanned){
        let index = _.findIndex(board,{row:row-1, col:col,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanVerticalForWin(row-1, col, count+1, board, indexScanned)
        }
        index = _.findIndex(board,{row:row+1, col:col,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanVerticalForWin(row+1, col, count+1, board, indexScanned)
        }        
        return count
    }

    ScanDiagonalBackwardForWin(row, col, count, board,indexScanned){
        let index = _.findIndex(board,{row:row-1, col:col-1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanDiagonalBackwardForWin(row-1, col-1, count+1, board, indexScanned)
        }
        index = _.findIndex(board,{row:row+1, col:col+1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanDiagonalBackwardForWin(row+1, col+1, count+1, board, indexScanned)
        }        
        return count
    }
    ScanDiagonalForwardForWin(row, col, count, board,indexScanned){
        let index = _.findIndex(board,{row:row+1, col:col-1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanDiagonalForwardForWin(row+1, col-1, count+1, board, indexScanned)
        }
        index = _.findIndex(board,{row:row-1, col:col+1,color:this.state.activePlayer})
        if (index !== -1 && !indexScanned.includes(index)) {
            indexScanned.push(index)
            count = this.ScanDiagonalForwardForWin(row-1, col+1, count+1, board, indexScanned)
        }        
        return count
    }

    SetPlayer(){
        let player = COLOR.NONE
        switch(this.state.activePlayer){
            case COLOR.RED:
                player = COLOR.BLACK;
                break;
            case COLOR.BLACK:
                player = COLOR.RED;
                break;
        }
        this.setState({
            activePlayer: player
        })
    }
    SetPlayerOne(color){
        this.setState({
            activePlayer: color,
            modal: false
        })
    }
    SetSelection = (col) => {
        let results = _.findLastIndex(this.state.board,{col:col,color:COLOR.NONE})
        if(results === -1)
            return;
        this.setState(state => {
            let selection = {}
            const board = state.board.map((item,j)=>{
                if (j === results) {
                    selection = {
                        row: item.row,
                        col: item.col
                    }
                    return {
                        ...item, color: this.state.activePlayer   
                    }
                }
                else{
                    return item
                }
            })
            return {
                board,
                selection

            }
        })
    }

    toggle() {
        this.setState(prevState => ({
          gameOverModal: !prevState.gameOverModal
        }));
      }
    componentDidUpdate(){
        if(!this.state.gameOver)
            this.ScanForTie()
    }
    render(){
        const board = (
            _.times(this.state.row, (x)=>{
                return(
                    <div>
                        {
                            _.times(this.state.column,(y)=>{
                                let result = _.find(this.state.board,(t)=> { return t.row === x && t.col === y})
                                return(
                                    <Circle row= {result.row} col={result.col} color={result.color} HandleSelection={this.HandleSelection}/>
                                )
                            }) 
                        }
                    </div>
                )
            })
        ) 
        const playerAssignment = (
                <Modal isOpen={this.state.modal}>
                    <ModalHeader>
                        Player 1 - Please Choose your Color:
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-md-6">
                                <Button color="secondary" block onClick={()=>this.SetPlayerOne(COLOR.BLACK)}>Black</Button>
                            </div>
                            <div className="col-md-6">
                                <Button color="danger" block onClick={()=>this.SetPlayerOne(COLOR.RED)}>Red</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
        )
        const gameOver = (
            <Modal isOpen={this.state.gameOverModal} toggle={this.toggle}>
                <ModalBody>
                    <div>
                        <h3>
                            {(this.state.isTie) ? "Tie Game!" : this.state.activePlayer + " Player Wins!"}
                        </h3>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="row">
                        <div className="col-md-12">
                        <Button color="primary" onClick={this.toggle} block>Ok</Button>
                        </div>
                    </div>
                    
                </ModalFooter>
            </Modal>
    )
        
        const player = this.state.activePlayer + " Player - Take Turn"
        return(
            <div>
                <div>
                    {gameOver}
                    {playerAssignment}
                    <h2>
                        {player}
                    </h2>
                    
                </div>
                <div className="gameboard">
                    {board}
                </div>
            </div>
        )
    }
}

export default GameBoard;