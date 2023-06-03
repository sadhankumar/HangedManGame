import logo from './logo.svg';
import React from 'react';
import { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { wordsData } from './words.js';

const App = () => {
  console.log('WORDS', wordsData);
  // API endpoints
  const API_SIGNUP = '/api/signup';
  // const API_RESOURCES = '/api/resources';
  const API_HISTORY = '/api/history';
  const API_HIGHSCORE = '/api/highscore';

  const [word, setWord] = useState('');
  const [hiddenWord, setHiddenWord] = useState('');
  const [inputLetter, setInputLetter] = useState('');
  const [lives, setLives] = useState(7);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    getRandomWord();
    fetchHighScore();
  }, []);

  const getRandomWord = async () => {
    try {
      // const response = await fetch(API_RESOURCES);
      // const data = await response.json();
      const randomWord =
        wordsData[Math.floor(Math.random() * wordsData.length)];
      setWord(randomWord);
      setHiddenWord('_'.repeat(randomWord.length));
    } catch (error) {
      console.log('Error fetching word:', error);
    }
  };

  const fetchHighScore = async () => {
    try {
      const response = await fetch(API_HIGHSCORE);
      const data = await response.json();
      setHighScore(data.highScore);
    } catch (error) {
      console.log('Error fetching high score:', error);
    }
  };

  const handleInputChange = (event) => {
    setInputLetter(event.target.value);
  };

  const handleConfirm = () => {
    if (inputLetter && word.includes(inputLetter)) {
      const revealedWord = word
        .split('')
        .map((letter) =>
          letter === inputLetter
            ? letter
            : hiddenWord[wordsData.indexOf(letter)]
        )
        .join('');

      setHiddenWord(revealedWord);
      setInputLetter('');
      console.log('hiddenWord', hiddenWord);
      if (revealedWord === word) {
        setScore(score + 1);
        setLives(7);
        getRandomWord();
      }
    } else {
      setLives(lives - 1);
      setInputLetter('');

      if (lives === 1) {
        endGame();
      }
    }
  };

  const endGame = async () => {
    try {
      await saveGameHistory();
      if (score > highScore) {
        await saveHighScore();
      }
    } catch (error) {
      console.log('Error saving game data:', error);
    }

    setScore(0);
    setLives(7);
    getRandomWord();
  };

  const saveGameHistory = async () => {
    try {
      const response = await fetch(API_HISTORY, {
        method: 'POST',
        body: JSON.stringify({ score }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('Game history saved:', data);
    } catch (error) {
      console.log('Error saving game history:', error);
    }
  };

  const saveHighScore = async () => {
    try {
      const response = await fetch(API_HIGHSCORE, {
        method: 'POST',
        body: JSON.stringify({ highScore: score }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log('High score saved:', data);
      setHighScore(score);
    } catch (error) {
      console.log('Error saving high score:', error);
    }
  };

  return (
    <div>
      <h1>Hanged Man Game</h1>
      <p>Guess the word letter by letter to gain score.</p>
      <p>Score: {score}</p>
      <p>Lives: {lives}</p>
      <p>High Score: {highScore}</p>
      <p>Hidden Word: {hiddenWord}</p>
      <input
        type="text"
        value={inputLetter}
        onChange={handleInputChange}
        maxLength={1}
      />
      <button onClick={handleConfirm} disabled={!inputLetter}>
        Confirm
      </button>
    </div>
  );
};

export default App ;

