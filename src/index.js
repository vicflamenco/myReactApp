import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }

    renderRows() {
        let rows = [];
        for (let row = 0; row < 3; row++) {
            let cols = [];
            for (let col = 0; col < 3; col++) {
                cols.push(this.renderSquare(row * 3 + col));
            }
            rows.push(<div className='board-row' key={row}>{cols}</div>);
        }
        return rows;
    }

    render() {
        return (
            <div>
                {this.renderRows()}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {

        const history = this.state.history.slice(); //0, this.state.stepNumber + 1
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.getNextPlayer();

        this.setState({
            history: history.concat([{
                squares: squares,
                row: calculateRow(i),
                col: calculateCol(i)
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    getNextPlayer() {
        return this.state.xIsNext ? 'X' : 'O';
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const status = winner ? 'Winner: ' + winner : 'Next player: ' + this.getNextPlayer();

        const moves = history.map((step, move) => {
        
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            let moveLocation = '(' + step.col + ',' + step.row + ')';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={classNames({'bold': this.state.stepNumber === move})}>
                        {desc} {moveLocation}
                    </button>
                    
                </li>
            );
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} index={current.index} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateRow(i) {
    return (i < 3) ? 0 : (i < 6) ? 1 : 2;
}

function calculateCol(i) {
    return i < 3 ? i : calculateCol(i - 3);
}

function calculateWinner(squares) {

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));