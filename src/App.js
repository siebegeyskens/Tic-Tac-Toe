import { useState } from "react";

function Square({ value, onSquareClick, winningSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={winningSquare ? { border: "2px solid red" } : {}}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, onPlay, squares, currentMove }) {
  function handleClick(i) {
    // Check if the square is already filled or there was a winner
    const { winner } = calculateWinner(squares);
    if (squares[i] || winner) {
      return;
    }
    // Copy the squares state (immutability)
    let nextSquares = [...squares];
    // Choose which symbol to write
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const { winner, winningLine } = calculateWinner(squares);
  let status;
  if (winner) {
    status = `winner is: ${winner}!`;
  } else if (currentMove === 9) {
    status = `There is no winner!`;
  } else {
    status = xIsNext ? "next move for X" : "next move for O";
  }

  // Generate rows and colums of Square components. This way similar code repetition for each row is avoided and and it's more scalable regarding changing board size.
  const rows = [...Array(3)].map((e, i) => (
    <div key={i} className="board-row">
      {[...Array(3)].map((e, j) => {
        const squareNumber = j + i * 3;
        return (
          <Square
            key={squareNumber}
            value={squares[squareNumber]}
            onSquareClick={() => handleClick(squareNumber)}
            winningSquare={winningLine && winningLine.includes(squareNumber)}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), moveLocation: -1 },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  let xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handleToggle() {
    setSortAscending(!sortAscending);
  }

  function handlePlay(nextSquares, location) {
    // Add the current boardstate or "squares" to the history.
    // - The slice is there in case the game jumped to a previous move, after a player clicks it will then keep the history untill the move that was jumped to and start adding to the history from there.
    let nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location: location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Why wouldn't I have moves as a component in stead of a variable?
  const moves = history.map((turnInfo, move) => {
    let description;
    let row = Math.floor(turnInfo.location / 3) + 1;
    let column = (turnInfo.location % 3) + 1;
    if (move > 0) {
      // description = "Go to move #" + move + " ";
      description = `Go to move # ${move} (${row}, ${column})`;
    } else {
      description = "Go to game start.";
    }
    // For every move show a button, instead of the last move
    return (
      <li key={move}>
        {move === currentMove ? (
          <p>
            You are at move #{move} {move !== 0 ? `(${row}, ${column})` : ""}
          </p>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          onPlay={handlePlay}
          xIsNext={xIsNext}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        {/* Based on the sort state show the moves reversed or not */}
        <ul>{sortAscending ? moves : [...moves].reverse()}</ul>
        <button onClick={handleToggle}>Toggle order</button>
      </div>
    </div>
  );
}

// This function comes from the React documentation
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return squares[a];
      return {
        winner: squares[a],
        winningLine: [a, b, c],
      };
    }
  }
  return {
    winner: null,
    winningLine: null,
  };
}
