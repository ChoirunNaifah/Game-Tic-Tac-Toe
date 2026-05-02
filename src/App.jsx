/* eslint-disable react/prop-types */
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  const isX = value === 'X';
  const isO = value === 'O';
  const squareClass = `square ${isX ? 'is-x' : ''} ${isO ? 'is-o' : ''}`;

  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  // Inisialisasi Audio dari folder public
  const clickSfx = new Audio('/click.mp3');
  const winSfx = new Audio('/win.mp3');
  const drawSfx = new Audio('/draw.mp3'); 

  const playSound = (audio) => {
    audio.currentTime = 0; 
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Audio play deferred:", err));
  };

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    // Logika penentuan suara
    const winner = calculateWinner(nextSquares);
    const isDraw = !winner && nextSquares.every((s) => s !== null);

    if (winner) {
      playSound(winSfx);
    } else if (isDraw) {
      playSound(drawSfx); 
    } else {
      playSound(clickSfx);
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((s) => s !== null);

  let status;
  if (winner) {
    status = `Winner: ${winner} 🎉`;
  } else if (isDraw) {
    status = "It's a Draw! 🤝";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, index) => (
          <Square 
            key={index} 
            value={value} 
            onSquareClick={() => handleClick(index)} 
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    new Audio('/click.mp3').play().catch(() => {});
  }

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Go to move #${move}` : 'Reset Game 🔄';
    return (
      <li key={move}>
        <button 
          className={move === currentMove ? 'active-move' : ''} 
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <h3>History</h3>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}