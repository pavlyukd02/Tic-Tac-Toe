interface ScoreBoardProps {
  scores: {
    xScore: number;
    oScore: number;
    total: number;
  };
  boardSize?: number; 
}

const ScoreBoard = ({ scores, boardSize }: ScoreBoardProps) => {
  const { xScore, oScore, total } = scores;

  return (
    <div className="scoreboard flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="text-lg font-semibold">
        Загальна кількість ігор: {total}
        {boardSize && ` (Сітка: ${boardSize}x${boardSize})`}
      </div>
      <div className="flex gap-8">
        <div className="player flex flex-col items-center">
          <h3 className="text-red-500 font-bold">Гравець X</h3>
          <h1 className="player-score text-2xl font-bold text-red-500">{xScore}</h1>
        </div>
        <div className="player flex flex-col items-center">
          <h3 className="text-yellow-500 font-bold">Гравець O</h3>
          <h1 className="player-score text-2xl font-bold text-yellow-500">{oScore}</h1>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;