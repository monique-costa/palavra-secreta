// React
import {useCallback, useEffect, useState} from 'react';

// CSS
import './App.css';

// Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

// Data
import {wordsList} from './data/words';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [sortedWord, setSortedWord] = useState("");
  const [sortedCategory, setSortedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(10);
  const [score, setScore] = useState(0);
 
  const sortCategoryAndWord = useCallback(() => {
    // Selecting a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Selecting a random word from said category
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return {word, category};
  }, [words])

  const startGame = useCallback(() => {
    // Sort a random category and a word from the list
    const {word, category} = sortCategoryAndWord();

    clearLetterStates();

    // Split the word into an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    // Fill in the states
    setSortedCategory(category);
    setSortedWord(word);
    setLetters(wordLetters);
    
    // Go to the game stage
    setGameStage(stages[1].name);
  }, [sortCategoryAndWord])

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    // push correct letter or remove a guess
    if (letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  useEffect(() => {
    if (guesses <= 0){
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if(uniqueLetters.length === guessedLetters.length){
      //add score
      setScore((actualScore) => actualScore += 100);

      //get new word
      startGame();
    }
  }, [guessedLetters, letters, startGame])

  const retry = () => {
    setScore(0);
    setGuesses(10);
    setGameStage(stages[0].name);
  }

  return (
    <div className="app">
      { gameStage === 'start' && <StartScreen startGame={startGame} /> }
      { gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          sortedWord={sortedWord} 
          sortedCategory={sortedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        /> 
      )}
      { gameStage === 'end' && <GameOver retry={retry} score={score} /> }
    </div>
  );
}

export default App;
