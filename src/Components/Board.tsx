import { useEffect, useRef, useState } from 'react';
import ScoreBoard from './ScoreBoard';
import ModalView from './ModalView';


interface GridScores {
  xScore: number;
  oScore: number;
  total: number;
}

interface AllScores {
  [key: number]: GridScores;
}

const Board = () => {

  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerX, setIsPlayerX] = useState(true); 
  const [message, setMessage] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [allScores, setAllScores] = useState<AllScores>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingSize, setPendingSize] = useState(3);

  const winConditions = useRef<number[][]>([]);


  const initializeWinConditions = (size: number) => {
    const conditions: number[][] = [];

    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      const col: number[] = [];
      for (let j = 0; j < size; j++) {
        row.push(i * size + j);
        col.push(j * size + i);
      }
      conditions.push(row, col);
    }

    const diag1: number[] = [];
    const diag2: number[] = [];
    for (let i = 0; i < size; i++) {
      diag1.push(i * size + i);
      diag2.push(i * size + (size - i - 1));
    }
    conditions.push(diag1, diag2);

    winConditions.current = conditions;
  };

  useEffect(() => {
    initializeWinConditions(boardSize);
    setBoard(Array(boardSize * boardSize).fill(null));
    resetGame();
  }, [boardSize]);


  const getCurrentScores = (): GridScores =>
    allScores[boardSize] ?? { xScore: 0, oScore: 0, total: 0 };

  // Перевірка переможця
  const checkWinner = (currentBoard: (string | null)[]): string | null => {
    for (const condition of winConditions.current) {
      const [first, ...rest] = condition;
      if (currentBoard[first] && rest.every((i) => currentBoard[i] === currentBoard[first])) {
        return currentBoard[first];
      }
    }
    return null;
  };

  const handleBoxClick = (index: number) => {
    if (board[index] || isGameOver) return;

    const newBoard = [...board];
    newBoard[index] = isPlayerX ? 'X' : 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);

    if (winner) {
      endGame(`Гравець ${winner === 'X' ? '1' : '2'} переміг. Вітаємо!`, {
        xScore: winner === 'X' ? getCurrentScores().xScore + 1 : getCurrentScores().xScore,
        oScore: winner === 'O' ? getCurrentScores().oScore + 1 : getCurrentScores().oScore,
        total: getCurrentScores().total + 1,
      });
    } else if (!newBoard.includes(null)) {
      endGame('Нічия! Спробуйте ще :)', {
        ...getCurrentScores(),
        total: getCurrentScores().total + 1,
      });
    } else {
      setIsPlayerX(!isPlayerX);
    }
  };


  const endGame = (msg: string, scores: GridScores) => {
    setIsGameOver(true);
    setTimeout(() => {
      setMessage(msg);
      setIsModalOpen(true);
      setAllScores((prev) => ({ ...prev, [boardSize]: scores }));
    }, 2000);
  };


  const resetGame = () => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsPlayerX(true);
    setIsGameOver(false);
    setMessage(null);
  };


  const handleNewGame = () => {
    if (boardSize !== pendingSize) {
      setBoardSize(pendingSize);
    } else {
      resetGame();
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="mb-4 text-lg font-semibold">
        Хід - Гравець {isPlayerX ? '1 (X)' : '2 (O)'}
      </h2>
      <ScoreBoard scores={getCurrentScores()} boardSize={boardSize} />

      <div className="my-4 flex items-center">
        <label className="mr-2">Розмір сітки:</label>
        <select
          className="p-1 border rounded"
          value={pendingSize}
          onChange={(e) => setPendingSize(Number(e.target.value))}
        >
          {Array.from({ length: 7 }, (_, i) => i + 3).map((size) => (
            <option key={size} value={size}>
              {size} x {size}
            </option>
          ))}
        </select>
        <button
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleNewGame}
        >
          Нова гра
        </button>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(2rem, 1fr))`,
          width: `${boardSize * 4}rem`,
        }}
      >
        {board.map((value, index) => (
          <button
            key={index}
            onClick={() => handleBoxClick(index)}
            className={`w-full aspect-square flex items-center justify-center text-xl font-bold rounded
              ${value === null ? 'bg-blue-100 hover:bg-blue-200' : value === 'X' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}
          >
            {value}
          </button>
        ))}
      </div>

      <ModalView
        isOpen={isModalOpen} message={message} onClose={closeModal}
      />
    </div>
  );
};

export default Board;